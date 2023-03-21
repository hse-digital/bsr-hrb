using System.Text.RegularExpressions;
using Flurl.Http;
using Flurl.Util;
using HSEPortal.API.Model;
using HSEPortal.API.Model.DynamicsSynchronisation;
using HSEPortal.API.Model.LocalAuthority;
using HSEPortal.Domain.DynamicsDefinitions;
using HSEPortal.Domain.Entities;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Services;

public class DynamicsService
{
    private readonly DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory;
    private readonly DynamicsApi dynamicsApi;
    private readonly DynamicsOptions dynamicsOptions;

    public DynamicsService(DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory, IOptions<DynamicsOptions> dynamicsOptions, DynamicsApi dynamicsApi)
    {
        this.dynamicsModelDefinitionFactory = dynamicsModelDefinitionFactory;
        this.dynamicsApi = dynamicsApi;
        this.dynamicsOptions = dynamicsOptions.Value;
    }

    public async Task<BuildingApplicationModel> RegisterNewBuildingApplicationAsync(BuildingApplicationModel buildingApplicationModel)
    {
        var building = await CreateBuildingAsync(buildingApplicationModel);
        var contact = await CreateContactAsync(buildingApplicationModel);
        var dynamicsBuildingApplication = await CreateBuildingApplicationAsync(contact, building);

        return buildingApplicationModel with { Id = dynamicsBuildingApplication.bsr_applicationid };
    }

    public async Task SendVerificationEmail(EmailVerificationModel emailVerificationModel, string otpToken)
    {
        await dynamicsOptions.EmailVerificationFlowUrl.PostJsonAsync(new
        {
            emailAddress = emailVerificationModel.EmailAddress,
            otp = otpToken
        });
    }

    public Task<LocalAuthoritiesSearchResponse> SearchLocalAuthorities(string authorityName)
    {
        return dynamicsApi.Get<LocalAuthoritiesSearchResponse>("accounts", new[]
        {
            ("$filter", $"_bsr_accounttype_accountid_value eq '{dynamicsOptions.LocalAuthorityTypeId}' and contains(name, '{authorityName}')"),
            ("$select", "name")
        });
    }

    public async Task<DynamicsBuildingApplication> GetBuildingApplicationUsingId(string applicationId)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingApplication>>("bsr_buildingapplications", new[]
        {
            ("$filter", $"bsr_applicationid eq '{applicationId}'"),
            ("$expand", "bsr_Building,bsr_RegistreeId")
        });

        return response.value.FirstOrDefault();
    }

    public async Task UpdateBuildingApplication(DynamicsBuildingApplication dynamicsBuildingApplication, DynamicsBuildingApplication buildingApplication)
    {
        await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})", buildingApplication);
    }

    public async Task CreateBuildingStructures(Structures structures)
    {
        var structureDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Structure, DynamicsStructure>();
        foreach (var section in structures.BuildingStructures)
        {
            var dynamicsStructure = BuildDynamicsStructure(structures, section, structureDefinition);
            dynamicsStructure = await SetYearOfCompletion(section, dynamicsStructure);
            dynamicsStructure = await CreateStructure(structureDefinition, dynamicsStructure);
            await CreateStructureOptionalAddresses(section, dynamicsStructure);
        }
    }

    public async Task CreateAccountablePersons(BuildingApplicationModel model, DynamicsBuildingApplication dynamicsBuildingApplication)
    {
        var pap = model.AccountablePersons[0];
        var papId = await CreateAccountablePerson(pap, dynamicsBuildingApplication, pap: true);
        await UpdateBuildingApplicationPap(papId, pap.Type == "organisation", dynamicsBuildingApplication, pap.IsPrincipal == "yes", pap.Role);

        foreach (var ap in model.AccountablePersons.Skip(1))
        {
            await CreateAccountablePerson(ap, dynamicsBuildingApplication);
        }
    }

    private async Task<string> CreateAccountablePerson(AccountablePerson accountablePerson, DynamicsBuildingApplication dynamicsBuildingApplication, bool pap = false)
    {
        var apAddress = accountablePerson.PapAddress ?? accountablePerson.Address;
        if (accountablePerson.Type == "organisation")
        {
            var accountId = await GetOrCreateOrganisationAccount(accountablePerson, apAddress);
            if (pap)
            {
                #region PAP

                if (accountablePerson.Role is "employee" or "registering_for")
                {
                    string leadContactId;
                    var existingLeadContact = await FindExistingContactAsync(accountablePerson.LeadFirstName, accountablePerson.LeadLastName, accountablePerson.LeadEmail, accountablePerson.LeadPhoneNumber);
                    if (existingLeadContact == null)
                    {
                        var dynamicsContact = new DynamicsContact
                        {
                            firstname = accountablePerson.LeadFirstName,
                            lastname = accountablePerson.LeadLastName,
                            emailaddress1 = accountablePerson.LeadEmail,
                            telephone1 = accountablePerson.LeadPhoneNumber,
                            jobRoleReferenceId = $"/bsr_jobroles({DynamicsJobRole.Ids[accountablePerson.LeadJobRole]})"
                        };

                        if (accountablePerson.Role == "registering_for")
                        {
                            var actingForAddress = accountablePerson.ActingForSameAddress == "yes" ? apAddress : accountablePerson.ActingForAddress;
                            dynamicsContact = dynamicsContact with
                            {
                                address1_line1 = string.Join(", ", actingForAddress.Address.Split(',').Take(3)),
                                address1_line2 = actingForAddress.AddressLineTwo,
                                address1_city = actingForAddress.Town,
                                address1_postalcode = actingForAddress.Postcode,
                            };
                        }

                        var newLeadContact = await dynamicsApi.Create("contacts", dynamicsContact);
                        leadContactId = ExtractEntityIdFromHeader(newLeadContact.Headers);
                        await AssignContactType(leadContactId, DynamicsContactTypes.PAPOrganisationLeadContact);
                    }
                    else
                    {
                        leadContactId = existingLeadContact.contactid;
                        if (existingLeadContact.bsr_contacttype_contact.All(x => x.bsr_contacttypeid != DynamicsContactTypes.PAPOrganisationLeadContact))
                        {
                            await AssignContactType(leadContactId, DynamicsContactTypes.PAPOrganisationLeadContact);
                        }
                    }

                    await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})", new DynamicsBuildingApplication { papLeadContactReferenceId = $"/contacts({leadContactId})" });
                }
                else if (accountablePerson.Role == "named_contact")
                {
                    var leadContact = await dynamicsApi.Update($"contacts({dynamicsBuildingApplication._bsr_registreeid_value})", new DynamicsContact
                    {
                        jobRoleReferenceId = $"/bsr_jobroles({DynamicsJobRole.Ids[accountablePerson.LeadJobRole]})"
                    });

                    var leadContactId = ExtractEntityIdFromHeader(leadContact.Headers);
                    await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})", new DynamicsBuildingApplication { papLeadContactReferenceId = $"/contacts({leadContactId})" });
                    await AssignContactType(leadContactId, DynamicsContactTypes.PAPOrganisationLeadContact);
                }

                #endregion
            }
            else
            {
                string namedContactId;
                var namedContact = await FindExistingContactAsync(accountablePerson.NamedContactFirstName, accountablePerson.NamedContactLastName, accountablePerson.NamedContactEmail, accountablePerson.NamedContactPhoneNumber);
                if (namedContact == null)
                {
                    var namedContactResponse = await dynamicsApi.Create("contacts", new DynamicsContact
                    {
                        firstname = accountablePerson.NamedContactFirstName,
                        lastname = accountablePerson.NamedContactLastName,
                        telephone1 = accountablePerson.NamedContactPhoneNumber,
                        emailaddress1 = accountablePerson.NamedContactEmail,
                    });

                    namedContactId = ExtractEntityIdFromHeader(namedContactResponse.Headers);
                    await AssignContactType(namedContactId, DynamicsContactTypes.APOrganisationLeadContact);
                }
                else
                {
                    namedContactId = namedContact.contactid;
                    if (namedContact.bsr_contacttype_contact.All(x => x.bsr_contacttypeid != DynamicsContactTypes.APOrganisationLeadContact))
                    {
                        await AssignContactType(namedContactId, DynamicsContactTypes.APOrganisationLeadContact);
                    }
                }

                foreach (var accountability in accountablePerson.SectionsAccountability)
                {
                    var sectionName = accountability.SectionName ?? dynamicsBuildingApplication.bsr_Building.bsr_name;
                    var areas = accountability.Accountability;

                    var structures = await dynamicsApi.Get<DynamicsResponse<DynamicsStructure>>("bsr_blocks", ("$filter", $"bsr_name eq '{sectionName}' and _bsr_buildingid_value eq '{dynamicsBuildingApplication._bsr_building_value}'"));
                    var structure = structures.value.First();

                    foreach (var area in areas)
                    {
                        var existingAp = await FindExistingAp(structure.bsr_blockid, accountId, area);
                        if (existingAp == null)
                        {
                            await dynamicsApi.Create("bsr_accountablepersons", new DynamicsAccountablePerson
                            {
                                bsr_accountablepersontype = DynamicAccountablePersonType.Organisation,
                                papAccountReferenceId = $"/accounts({accountId})",
                                structureReferenceId = $"/bsr_blocks({structure.bsr_blockid})",
                                sectionAreaReferenceId = $"/bsr_blockareas({DynamicsSectionArea.Ids[area]})",
                                leadContactReferenceId = $"/contacts({namedContactId})"
                            });
                        }
                    }
                }
            }

            return $"/accounts({accountId})";
        }

        if (accountablePerson.Type == "individual")
        {
            if (accountablePerson.IsPrincipal is null or "no")
            {
                string contactId;

                var existingPrincipal = await FindExistingContactAsync(accountablePerson.FirstName, accountablePerson.LastName, accountablePerson.Email, accountablePerson.PhoneNumber);
                var apType = pap ? DynamicsContactTypes.PrincipalAccountablePerson : DynamicsContactTypes.AccountablePerson;
                if (existingPrincipal == null)
                {
                    var response = await dynamicsApi.Create("contacts", new DynamicsContact
                    {
                        firstname = accountablePerson.FirstName,
                        lastname = accountablePerson.LastName,
                        telephone1 = accountablePerson.PhoneNumber,
                        emailaddress1 = accountablePerson.Email,
                        address1_line1 = string.Join(", ", apAddress.Address.Split(',').Take(3)),
                        address1_line2 = apAddress.AddressLineTwo,
                        address1_city = apAddress.Town,
                        address1_postalcode = apAddress.Postcode,
                        bsr_manualaddress = apAddress.IsManual ? YesNoOption.Yes : YesNoOption.No
                    });

                    contactId = ExtractEntityIdFromHeader(response.Headers);
                    await AssignContactType(contactId, apType);
                }
                else
                {
                    contactId = existingPrincipal.contactid;
                    if (existingPrincipal.bsr_contacttype_contact.All(x => x.bsr_contacttypeid != apType))
                    {
                        await AssignContactType(contactId, apType);
                    }
                }

                foreach (var accountability in accountablePerson.SectionsAccountability ?? Array.Empty<SectionAccountability>())
                {
                    var sectionName = accountability.SectionName ?? dynamicsBuildingApplication.bsr_Building.bsr_name;
                    var areas = accountability.Accountability;

                    var structures = await dynamicsApi.Get<DynamicsResponse<DynamicsStructure>>("bsr_blocks", ("$filter", $"bsr_name eq '{sectionName}' and _bsr_buildingid_value eq '{dynamicsBuildingApplication._bsr_building_value}'"));
                    var structure = structures.value.First();

                    foreach (var area in areas)
                    {
                        var existingAp = await FindExistingAp(structure.bsr_blockid, contactId, area);
                        if (existingAp == null)
                        {
                            await dynamicsApi.Create("bsr_accountablepersons", new DynamicsAccountablePerson
                            {
                                bsr_accountablepersontype = DynamicAccountablePersonType.Individual,
                                papContactReferenceId = $"/contacts({contactId})",
                                structureReferenceId = $"/bsr_blocks({structure.bsr_blockid})",
                                sectionAreaReferenceId = $"/bsr_blockareas({DynamicsSectionArea.Ids[area]})"
                            });
                        }
                    }
                }

                return $"/contacts({contactId})";
            }
        }

        return $"/contacts({dynamicsBuildingApplication._bsr_registreeid_value})";
    }

    private async Task UpdateBuildingApplicationPap(string papId, bool organisation, DynamicsBuildingApplication dynamicsBuildingApplication, bool individualIsPap, string papRole)
    {
        var lookup = new DynamicsPapLookup();
        int? papType;
        if (organisation)
        {
            papType = 760810001;
            lookup = lookup with { papAccountReferenceId = papId };
            switch (papRole)
            {
                case "employee":
                    lookup = lookup with { bsr_whoareyou = BuildingApplicationWhoAreYou.Employee };
                    break;
                case "registering_for":
                    lookup = lookup with { bsr_whoareyou = BuildingApplicationWhoAreYou.RegisteringFor };
                    break;
                case "named_contact":
                    lookup = lookup with { bsr_whoareyou = BuildingApplicationWhoAreYou.NamedContact };
                    break;
            }
        }
        else
        {
            papType = 760810000;
            lookup = lookup with { papContactReferenceId = papId };
        }

        var areTouThePap = !organisation && individualIsPap;
        await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})", lookup with { bsr_paptype = papType, bsr_areyouthepap = areTouThePap });
        await dynamicsApi.Update($"bsr_buildings({dynamicsBuildingApplication._bsr_building_value})", lookup with { bsr_paptypecode = papType, bsr_whoareyou = null });
    }

    public async Task CreatePayment(BuildingApplicationModel model, DynamicsBuildingApplication dynamicsBuildingApplication)
    {
        var payment = model.Payment;
        await dynamicsApi.Create("bsr_payments", new DynamicsPayment
        {
            buildingApplicationReferenceId = $"/bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})",
            bsr_lastfourdigitsofnumber = int.Parse(payment.LastFourDigitsCardNumber),
            bsr_timeanddateoftransaction = payment.CreatedDate,
            bsr_transactionid = payment.Reference,
            bsr_service = "HRB Registration",
            bsr_cardexpirydate = payment.CardExpiryDate,
            bsr_billingaddress = string.Join(", ", new[] { payment.AddressLineOne, payment.AddressLineTwo, payment.Postcode, payment.City, payment.Country }.Where(x => !string.IsNullOrWhiteSpace(x))),
            bsr_cardbrandegvisa = payment.CardBrand,
            bsr_cardtypecreditdebit = payment.CardType == "debit" ? DynamicsPaymentCardType.Debit : DynamicsPaymentCardType.Credit,
            bsr_amountpaid = payment.Amount / 100,
            bsr_govukpaystatus = payment.Status,
        });
    }

    private async Task<DynamicsAccountablePerson> FindExistingAp(string sectionId, string accountId, string area)
    {
        var existingAreaAp = await dynamicsApi.Get<DynamicsResponse<DynamicsAccountablePerson>>("bsr_accountablepersons", new[]
        {
            ("$filter", $"_bsr_independentsection_value eq '{sectionId}' and _bsr_apid_value eq '{accountId}' and _bsr_sectionarea_value eq '{DynamicsSectionArea.Ids[area]}'")
        });

        return existingAreaAp.value.FirstOrDefault();
    }

    private async Task AssignContactType(string contactId, string contactTypeId)
    {
        await dynamicsApi.Create($"contacts({contactId})/bsr_contacttype_contact/$ref", new DynamicsContactType
        {
            contactTypeReferenceId = $"{dynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_contacttypes({contactTypeId})"
        });
    }

    private async Task<string> GetOrCreateOrganisationAccount(AccountablePerson accountablePerson, BuildingAddress apAddress)
    {
        var existingAccount = await FindExistingAccountAsync(accountablePerson.OrganisationName, apAddress.Postcode);
        if (existingAccount == null)
        {
            var response = await dynamicsApi.Create("accounts", new DynamicsAccount
            {
                name = accountablePerson.OrganisationName,
                address1_line1 = string.Join(", ", apAddress.Address.Split(',').Take(3)),
                address1_line2 = apAddress.AddressLineTwo,
                address1_city = apAddress.Town,
                address1_postalcode = apAddress.Postcode,
                acountTypeReferenceId = $"/bsr_accounttypes({DynamicsAccountType.Ids[$"{accountablePerson.OrganisationType}"]})"
            });

            return ExtractEntityIdFromHeader(response.Headers);
        }

        return existingAccount.accountid;
    }

    private async Task CreateStructureOptionalAddresses(SectionModel section, DynamicsStructure dynamicsStructure)
    {
        foreach (var address in section.Addresses.Skip(1))
        {
            await dynamicsApi.Create("bsr_addresses", new DynamicsAddress
            {
                bsr_line1 = string.Join(", ", address.Address.Split(',').Take(3)),
                bsr_line2 = address.AddressLineTwo,
                bsr_addresstypecode = AddressType.Other,
                bsr_city = address.Town,
                bsr_postcode = address.Postcode,
                bsr_uprn = address.UPRN,
                bsr_usrn = address.USRN,
                bsr_manualaddress = address.IsManual ? YesNoOption.Yes : YesNoOption.No,
                structureReferenceId = $"/bsr_blocks({dynamicsStructure.bsr_blockid})"
            });
        }
    }

    private async Task<DynamicsStructure> SetYearOfCompletion(SectionModel section, DynamicsStructure dynamicsStructure)
    {
        if (dynamicsStructure.bsr_doyouknowtheblocksexactconstructionyear == ConstructionYearOption.Exact)
        {
            var yearResponse = await dynamicsApi.Get<DynamicsResponse<DynamicsYear>>("bsr_years", ("$filter", $"bsr_name eq '{section.YearOfCompletion}'"));
            return dynamicsStructure with { exactConstructionYearReferenceId = $"/bsr_years({yearResponse.value[0].bsr_yearid})" };
        }

        if (dynamicsStructure.bsr_doyouknowtheblocksexactconstructionyear == ConstructionYearOption.YearRange)
        {
            var yearRangesResponse = await dynamicsApi.Get<DynamicsResponse<DynamicsYearRange>>("bsr_sectioncompletionyearranges", ("$filter", $"bsr_name eq '{section.YearOfCompletionRange.Replace("-", " ")}'"));
            return dynamicsStructure with { sectionCompletionYearRangeReferenceId = $"/bsr_sectioncompletionyearranges({yearRangesResponse.value[0].bsr_sectioncompletionyearrangeid})" };
        }

        return dynamicsStructure;
    }

    private static DynamicsStructure BuildDynamicsStructure(Structures structures, SectionModel section, DynamicsModelDefinition<Structure, DynamicsStructure> structureDefinition)
    {
        var structure = new Structure(section.Name ?? structures.DynamicsBuildingApplication.bsr_Building?.bsr_name, section.FloorsAbove, section.Height, section.ResidentialUnits, section.PeopleLivingInBuilding, section.YearOfCompletionOption);
        var dynamicsStructure = structureDefinition.BuildDynamicsEntity(structure);

        var primaryAddress = section.Addresses[0];
        dynamicsStructure = dynamicsStructure with
        {
            buildingReferenceId = $"/bsr_buildings({structures.DynamicsBuildingApplication._bsr_building_value})",
            buildingApplicationReferenceId = $"/bsr_buildingapplications({structures.DynamicsBuildingApplication.bsr_buildingapplicationid})",
            bsr_addressline1 = string.Join(", ", primaryAddress.Address.Split(',').Take(3)),
            bsr_addressline2 = primaryAddress.AddressLineTwo,
            bsr_addresstype = AddressType.Primary,
            bsr_city = primaryAddress.Town,
            bsr_postcode = primaryAddress.Postcode,
            bsr_uprn = primaryAddress.UPRN,
            bsr_usrn = primaryAddress.USRN,
            bsr_manualaddress = primaryAddress.IsManual ? YesNoOption.Yes : YesNoOption.No
        };

        return dynamicsStructure;
    }

    private async Task<DynamicsStructure> CreateStructure(DynamicsModelDefinition<Structure, DynamicsStructure> structureDefinition, DynamicsStructure dynamicsStructure)
    {
        var response = await dynamicsApi.Create(structureDefinition.Endpoint, dynamicsStructure);
        var structureId = ExtractEntityIdFromHeader(response.Headers);
        return dynamicsStructure with { bsr_blockid = structureId };
    }

    private async Task<DynamicsBuildingApplication> CreateBuildingApplicationAsync(Contact contact, Building building)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<BuildingApplication, DynamicsBuildingApplication>();
        var buildingApplication = new BuildingApplication(contact.Id, building.Id);
        var dynamicsBuildingApplication = modelDefinition.BuildDynamicsEntity(buildingApplication);

        var response = await dynamicsApi.Create(modelDefinition.Endpoint, dynamicsBuildingApplication, returnObjectResponse: true);
        return await response.GetJsonAsync<DynamicsBuildingApplication>();
    }

    private async Task<Building> CreateBuildingAsync(BuildingApplicationModel model)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Building, DynamicsBuilding>();
        var building = new Building(model.BuildingName);
        var dynamicsBuilding = modelDefinition.BuildDynamicsEntity(building);

        var response = await dynamicsApi.Create(modelDefinition.Endpoint, dynamicsBuilding);
        var buildingId = ExtractEntityIdFromHeader(response.Headers);
        return building with { Id = buildingId };
    }

    private async Task<Contact> CreateContactAsync(BuildingApplicationModel model)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Contact, DynamicsContact>();
        var contact = new Contact(model.ContactFirstName, model.ContactLastName, model.ContactPhoneNumber, model.ContactEmailAddress);
        var dynamicsContact = modelDefinition.BuildDynamicsEntity(contact);

        var existingContact = await FindExistingContactAsync(contact.FirstName, contact.LastName, contact.Email, contact.PhoneNumber);
        if (existingContact == null)
        {
            var response = await dynamicsApi.Create(modelDefinition.Endpoint, dynamicsContact);
            var contactId = ExtractEntityIdFromHeader(response.Headers);
            await AssignContactType(contactId, DynamicsContactTypes.HRBRegistrationApplicant);

            return contact with { Id = contactId };
        }

        return contact with { Id = existingContact.contactid };
    }

    private async Task<DynamicsContact> FindExistingContactAsync(string firstName, string lastName, string email, string phoneNumber)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsContact>>("contacts", new[]
        {
            ("$filter", $"firstname eq '{firstName}' and lastname eq '{lastName}' and emailaddress1 eq '{email}' and contains(telephone1, '{phoneNumber.Replace("+", string.Empty)}')"),
            ("$expand", "bsr_contacttype_contact")
        });

        return response.value.FirstOrDefault();
    }

    private async Task<DynamicsAccount> FindExistingAccountAsync(string organisationName, string postcode)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsAccount>>("accounts", ("$filter", $"name eq '{organisationName}' and address1_postalcode eq '{postcode}'"));

        return response.value.FirstOrDefault();
    }

    internal async Task<string> GetAuthenticationTokenAsync()
    {
        var response = await $"https://login.microsoftonline.com/{dynamicsOptions.TenantId}/oauth2/token"
            .PostUrlEncodedAsync(new
            {
                grant_type = "client_credentials",
                client_id = dynamicsOptions.ClientId,
                client_secret = dynamicsOptions.ClientSecret,
                resource = dynamicsOptions.EnvironmentUrl
            })
            .ReceiveJson<DynamicsAuthenticationModel>();

        return response.AccessToken;
    }

    private string ExtractEntityIdFromHeader(IReadOnlyNameValueList<string> headers)
    {
        var header = headers.FirstOrDefault(x => x.Name == "OData-EntityId");
        var id = Regex.Match(header.Value, @"\((.+)\)");

        return id.Groups[1].Value;
    }
}