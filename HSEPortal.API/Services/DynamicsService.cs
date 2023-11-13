using System.Globalization;
using System.Text.RegularExpressions;
using Flurl;
using Flurl.Http;
using Flurl.Util;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.DynamicsSynchronisation;
using HSEPortal.API.Model.LocalAuthority;
using HSEPortal.API.Model.Payment;
using HSEPortal.API.Model.Payment.Request;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.Domain.DynamicsDefinitions;
using HSEPortal.Domain.Entities;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Services;

public class DynamicsService
{
    private readonly DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory;
    private readonly SwaOptions swaOptions;
    private readonly DynamicsApi dynamicsApi;
    private readonly DynamicsOptions dynamicsOptions;
    private readonly IntegrationsOptions integrationsOptions;

    public DynamicsService(DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory, IOptions<DynamicsOptions> dynamicsOptions, IOptions<SwaOptions> swaOptions, IOptions<IntegrationsOptions> integrationOptions,
        DynamicsApi dynamicsApi)
    {
        this.dynamicsModelDefinitionFactory = dynamicsModelDefinitionFactory;
        this.dynamicsApi = dynamicsApi;
        this.swaOptions = swaOptions.Value;
        this.dynamicsOptions = dynamicsOptions.Value;
        this.integrationsOptions = integrationOptions.Value;
    }

    public async Task<BuildingApplicationModel> RegisterNewBuildingApplicationAsync(BuildingApplicationModel buildingApplicationModel)
    {
        var building = await CreateBuildingAsync(buildingApplicationModel);
        var contact = await CreateContactAsync(buildingApplicationModel);
        var dynamicsBuildingApplication = await CreateBuildingApplicationAsync(contact, building);

        return buildingApplicationModel with { Id = dynamicsBuildingApplication.bsr_applicationid };
    }

    public async Task SendVerificationEmail(string emailAddress, string buildingName, string otpToken)
    {
        await dynamicsOptions.EmailVerificationFlowUrl.PostJsonAsync(new { emailAddress = emailAddress.ToLower(), otp = otpToken, buildingName = buildingName, hrbRegUrl = swaOptions.Url });
    }

    public Task<DynamicsOrganisationsSearchResponse> SearchLocalAuthorities(string authorityName)
    {
        return SearchOrganisations(authorityName, dynamicsOptions.LocalAuthorityTypeId);
    }

    public Task<DynamicsOrganisationsSearchResponse> SearchSocialHousingOrganisations(string authorityName)
    {
        return SearchOrganisations(authorityName, DynamicsOptions.SocialHousingTypeId);
    }

    private Task<DynamicsOrganisationsSearchResponse> SearchOrganisations(string authorityName, string accountTypeId)
    {
        return dynamicsApi.Get<DynamicsOrganisationsSearchResponse>("accounts",
            new[] { ("$filter", $"_bsr_accounttype_accountid_value eq '{accountTypeId}' and contains(name, '{authorityName.EscapeSingleQuote()}')"), ("$select", "name") });
    }

    public async Task<DynamicsBuildingApplication> GetBuildingApplicationUsingId(string applicationId)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingApplication>>("bsr_buildingapplications",
            new[] { ("$filter", $"bsr_applicationid eq '{applicationId}'"), ("$expand", "bsr_Building,bsr_RegistreeId") });

        return response.value.FirstOrDefault();
    }

    
    public async Task<DynamicsBuildingApplicationStatuscodeModel> GetBuildingApplicationStatuscodeBy(string applicationId)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingApplicationStatuscodeModel>>("bsr_buildingapplications",
            new[] { ("$filter", $"bsr_applicationid eq '{applicationId}'"), ("$select", "statuscode") });

        return response.value.FirstOrDefault();
    }

    public async Task UpdateBuildingApplication(DynamicsBuildingApplication dynamicsBuildingApplication, DynamicsBuildingApplication buildingApplication)
    {
        await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})", buildingApplication);
    }

    public async Task CreateBuildingStructures(Structures structures)
    {
        var structureDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Structure, DynamicsStructure>();
        var InScopeStructures = structures.BuildingStructures.Where(x => x.Addresses != null && x.Addresses.Length > 0);
        foreach (var section in InScopeStructures)
        {
            var dynamicsStructure = BuildDynamicsStructure(structures, section, structureDefinition);
            dynamicsStructure = await SetYearOfCompletion(section, dynamicsStructure);
            dynamicsStructure = await CreateStructure(structureDefinition, dynamicsStructure, structures.DynamicsBuildingApplication.bsr_buildingapplicationid);

            await CreateStructureCompletionCertificate(section, dynamicsStructure);
            await CreateStructureOptionalAddresses(section, dynamicsStructure);

            if (section.Duplicate?.IsDuplicated ?? false) {
                await CreateAssociatedDuplicatedStructures(section, dynamicsStructure);  
            }
        }
    }

    private async Task CreateAssociatedDuplicatedStructures(SectionModel section, DynamicsStructure dynamicsStructure)
    {
        if(section.Duplicate != null && section.Duplicate.BlockIds != null && section.Duplicate.BlockIds.Length > 0)
        {
            foreach(var blockId in section.Duplicate.BlockIds) {
                await dynamicsApi.Put($"bsr_blocks({dynamicsStructure.bsr_blockid})/bsr_duplicatestructures/$ref", new DynamicsDuplicatedStructure
                {
                    relationshipId = $"{dynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_blocks({blockId})"
                });
            }
        }
    }

    public async Task CreateAssociatedDuplicatedBuildingApplications(BuildingApplicationModel buildingApplicationModel, DynamicsBuildingApplication dynamicsBuildingApplication)
    {
        if(buildingApplicationModel.DuplicateDetected != null && (bool)buildingApplicationModel.DuplicateDetected && buildingApplicationModel.DuplicateBuildingApplicationIds != null && buildingApplicationModel.DuplicateBuildingApplicationIds.Length > 0) {
            foreach(var buildingApplicationId in buildingApplicationModel.DuplicateBuildingApplicationIds) {
                await dynamicsApi.Put($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})/bsr_duplicatebuildingapplications/$ref", new DynamicsDuplicatedStructure
                {
                    relationshipId = $"{dynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildingapplications({buildingApplicationId})"
                });
            }
        }
    }

    public async Task CreateAccountablePersons(BuildingApplicationModel model, DynamicsBuildingApplication dynamicsBuildingApplication)
    {
        var pap = model.CurrentVersion.AccountablePersons[0];
        var papId = await CreateAccountablePerson(pap, dynamicsBuildingApplication, pap: true);
        await UpdateBuildingApplicationPap(papId, pap.Type == "organisation", dynamicsBuildingApplication, pap.IsPrincipal == "yes", pap.Role);

        foreach (var ap in model.CurrentVersion.AccountablePersons.Skip(1))
        {
            await CreateAccountablePerson(ap, dynamicsBuildingApplication);
        }
    }

    public async Task<List<DynamicsPayment>> GetPayments(string applicationNumber)
    {
        var buildingApplication = await GetBuildingApplicationUsingId(applicationNumber);
        if (buildingApplication == null)
            return new List<DynamicsPayment>();

        var payments = await dynamicsApi.Get<DynamicsResponse<DynamicsPayment>>("bsr_payments",
            ("$filter", $"_bsr_buildingapplicationid_value eq '{buildingApplication.bsr_buildingapplicationid}'"));

        return payments.value;
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

                string leadContactId;
                if (accountablePerson.Role is "employee" or "registering_for")
                {
                    var existingLeadContact = await FindExistingContactAsync(accountablePerson.LeadFirstName, accountablePerson.LeadLastName, accountablePerson.LeadEmail,
                        accountablePerson.LeadPhoneNumber);
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
                                bsr_manualaddress = actingForAddress.IsManual ? YesNoOption.Yes : YesNoOption.No,
                                countryReferenceId = actingForAddress.Country is "E" or "W" ? $"/bsr_countries({DynamicsCountryCodes.Ids[actingForAddress.Country]})" : null
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

                    await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})",
                        new DynamicsBuildingApplication { papLeadContactReferenceId = $"/contacts({leadContactId})" });
                }
                else
                {
                    var leadContact = await dynamicsApi.Update($"contacts({dynamicsBuildingApplication._bsr_registreeid_value})",
                        new DynamicsContact { jobRoleReferenceId = $"/bsr_jobroles({DynamicsJobRole.Ids[accountablePerson.LeadJobRole]})" });

                    leadContactId = ExtractEntityIdFromHeader(leadContact.Headers);
                    await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})",
                        new DynamicsBuildingApplication { papLeadContactReferenceId = $"/contacts({leadContactId})" });
                    await AssignContactType(leadContactId, DynamicsContactTypes.PAPOrganisationLeadContact);
                }

                foreach (var accountability in accountablePerson.SectionsAccountability)
                {
                    var sectionName = accountability.SectionName ?? dynamicsBuildingApplication.bsr_Building.bsr_name;
                    var areas = accountability.Accountability;

                    var structures = await dynamicsApi.Get<DynamicsResponse<DynamicsStructure>>("bsr_blocks",
                        ("$filter", $"bsr_name eq '{sectionName.EscapeSingleQuote()}' and _bsr_buildingid_value eq '{dynamicsBuildingApplication._bsr_building_value}'"));
                    var structure = structures.value.First();

                    foreach (var area in areas)
                    {
                        var existingAp = await FindExistingAp(structure.bsr_blockid, accountId, area);
                        if (existingAp == null)
                        {
                            await dynamicsApi.Create("bsr_accountablepersons",
                                new DynamicsAccountablePerson
                                {
                                    bsr_accountablepersontype =
                                        accountablePerson.Type == "organisation" ? DynamicAccountablePersonType.Organisation : DynamicAccountablePersonType.Individual,
                                    papAccountReferenceId = $"/accounts({accountId})",
                                    structureReferenceId = $"/bsr_blocks({structure.bsr_blockid})",
                                    sectionAreaReferenceId = $"/bsr_blockareas({DynamicsSectionArea.Ids[area]})",
                                    leadContactReferenceId = $"/contacts({leadContactId})"
                                });
                        }
                    }
                }

                #endregion
            }
            else
            {
                string namedContactId;
                var namedContact = await FindExistingContactAsync(accountablePerson.NamedContactFirstName, accountablePerson.NamedContactLastName,
                    accountablePerson.NamedContactEmail, accountablePerson.NamedContactPhoneNumber);
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

                    var structures = await dynamicsApi.Get<DynamicsResponse<DynamicsStructure>>("bsr_blocks",
                        ("$filter", $"bsr_name eq '{sectionName.EscapeSingleQuote()}' and _bsr_buildingid_value eq '{dynamicsBuildingApplication._bsr_building_value}'"));
                    var structure = structures.value.First();

                    foreach (var area in areas)
                    {
                        var existingAp = await FindExistingAp(structure.bsr_blockid, accountId, area);
                        if (existingAp == null)
                        {
                            await dynamicsApi.Create("bsr_accountablepersons",
                                new DynamicsAccountablePerson
                                {
                                    bsr_accountablepersontype = accountablePerson.Type == "organisation" ? DynamicAccountablePersonType.Organisation : DynamicAccountablePersonType.Individual,
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

                var existingPrincipal =
                    await FindExistingContactAsync(accountablePerson.FirstName, accountablePerson.LastName, accountablePerson.Email, accountablePerson.PhoneNumber);
                var apType = pap ? DynamicsContactTypes.PrincipalAccountablePerson : DynamicsContactTypes.AccountablePerson;
                if (existingPrincipal == null)
                {
                    var response = await dynamicsApi.Create("contacts",
                        new DynamicsContact
                        {
                            firstname = accountablePerson.FirstName,
                            lastname = accountablePerson.LastName,
                            telephone1 = accountablePerson.PhoneNumber,
                            emailaddress1 = accountablePerson.Email,
                            address1_line1 = string.Join(", ", apAddress.Address.Split(',').Take(3)),
                            address1_line2 = apAddress.AddressLineTwo,
                            address1_city = apAddress.Town,
                            address1_postalcode = apAddress.Postcode,
                            countryReferenceId = apAddress.Country is "E" or "W" ? $"/bsr_countries({DynamicsCountryCodes.Ids[apAddress.Country]})" : null,
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

                    var structures = await dynamicsApi.Get<DynamicsResponse<DynamicsStructure>>("bsr_blocks",
                        ("$filter", $"bsr_name eq '{sectionName.EscapeSingleQuote()}' and _bsr_buildingid_value eq '{dynamicsBuildingApplication._bsr_building_value}'"));
                    var structure = structures.value.First();

                    foreach (var area in areas)
                    {
                        var existingAp = await FindExistingAp(structure.bsr_blockid, contactId, area);
                        if (existingAp == null)
                        {
                            await dynamicsApi.Create("bsr_accountablepersons",
                                new DynamicsAccountablePerson
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

        var principalContact = await dynamicsApi.Get<DynamicsContact>($"contacts({dynamicsBuildingApplication._bsr_registreeid_value})", ("$expand", "bsr_contacttype_contact"));
        if (principalContact.bsr_contacttype_contact.All(x => x.bsr_contacttypeid != DynamicsContactTypes.PrincipalAccountablePerson))
        {
            await AssignContactType(dynamicsBuildingApplication._bsr_registreeid_value, DynamicsContactTypes.PrincipalAccountablePerson);
        }

        await dynamicsApi.Update($"contacts({dynamicsBuildingApplication._bsr_registreeid_value})",
            new DynamicsContact
            {
                address1_line1 = string.Join(", ", apAddress.Address.Split(',').Take(3)),
                address1_line2 = apAddress.AddressLineTwo,
                address1_city = apAddress.Town,
                address1_postalcode = apAddress.Postcode,
                countryReferenceId = apAddress.Country is "E" or "W" ? $"/bsr_countries({DynamicsCountryCodes.Ids[apAddress.Country]})" : null,
                bsr_manualaddress = apAddress.IsManual ? YesNoOption.Yes : YesNoOption.No
            });

        foreach (var accountability in accountablePerson.SectionsAccountability ?? Array.Empty<SectionAccountability>())
        {
            var sectionName = accountability.SectionName ?? dynamicsBuildingApplication.bsr_Building.bsr_name;
            var areas = accountability.Accountability;

            var structures = await dynamicsApi.Get<DynamicsResponse<DynamicsStructure>>("bsr_blocks",
                ("$filter", $"bsr_name eq '{sectionName.EscapeSingleQuote()}' and _bsr_buildingid_value eq '{dynamicsBuildingApplication._bsr_building_value}'"));
            var structure = structures.value.First();

            foreach (var area in areas)
            {
                var existingAp = await FindExistingAp(structure.bsr_blockid, dynamicsBuildingApplication._bsr_registreeid_value, area);
                if (existingAp == null)
                {
                    await dynamicsApi.Create("bsr_accountablepersons",
                        new DynamicsAccountablePerson
                        {
                            bsr_accountablepersontype = DynamicAccountablePersonType.Individual,
                            papContactReferenceId = $"/contacts({dynamicsBuildingApplication._bsr_registreeid_value})",
                            structureReferenceId = $"/bsr_blocks({structure.bsr_blockid})",
                            sectionAreaReferenceId = $"/bsr_blockareas({DynamicsSectionArea.Ids[area]})"
                        });
                }
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

    public async Task NewPayment(string applicationId, PaymentResponseModel payment)
    {
        var application = await GetBuildingApplicationUsingId(applicationId);
        await CreateCardPayment(new BuildingApplicationPayment(application.bsr_buildingapplicationid, payment));
    }

    public async Task CreateCardPayment(BuildingApplicationPayment buildingApplicationPayment)
    {
        var payment = buildingApplicationPayment.Payment;
        var existingPayment = await dynamicsApi.Get<DynamicsResponse<DynamicsPayment>>("bsr_payments", ("$filter", $"bsr_service eq 'HRB Registration' and bsr_transactionid eq '{payment.Reference}'"));
        if (!existingPayment.value.Any())
        {
            await dynamicsApi.Create("bsr_payments", new DynamicsPayment
            {
                buildingApplicationReferenceId = $"/bsr_buildingapplications({buildingApplicationPayment.BuildingApplicationId})",
                bsr_lastfourdigitsofcardnumber = payment.LastFourDigitsCardNumber,
                bsr_timeanddateoftransaction = payment.CreatedDate,
                bsr_transactionid = payment.Reference,
                bsr_paymenttypecode = 760_810_000, // Card
                bsr_service = "HRB Registration",
                bsr_cardexpirydate = payment.CardExpiryDate,
                bsr_billingaddress = string.Join(", ", new[] { payment.AddressLineOne, payment.AddressLineTwo, payment.Postcode, payment.City, payment.Country }.Where(x => !string.IsNullOrWhiteSpace(x))),
                bsr_cardbrandegvisa = payment.CardBrand,
                bsr_cardtypecreditdebit = payment.CardType == "debit" ? DynamicsPaymentCardType.Debit : DynamicsPaymentCardType.Credit,
                bsr_amountpaid = Math.Round((float)payment.Amount / 100, 2),
                bsr_govukpaystatus = payment.Status,
                bsr_govukpaymentid = payment.PaymentId
            });
        }
        else
        {
            var dynamicsPayment = existingPayment.value[0];
            await dynamicsApi.Update($"bsr_payments({dynamicsPayment.bsr_paymentid})",
                new DynamicsPayment
                {
                    bsr_timeanddateoftransaction = payment.CreatedDate,
                    bsr_govukpaystatus = payment.Status,
                    bsr_cardexpirydate = payment.CardExpiryDate,
                    bsr_billingaddress = string.Join(", ", new[] { payment.AddressLineOne, payment.AddressLineTwo, payment.Postcode, payment.City, payment.Country }.Where(x => !string.IsNullOrWhiteSpace(x))),
                    bsr_cardbrandegvisa = payment.CardBrand,
                    bsr_cardtypecreditdebit = payment.CardType == "debit" ? DynamicsPaymentCardType.Debit : DynamicsPaymentCardType.Credit,
                    bsr_lastfourdigitsofcardnumber = payment.LastFourDigitsCardNumber,
                    bsr_amountpaid = Math.Round((float)payment.Amount / 100, 2)
                });
        }
    }

    public async Task NewInvoicePayment(BuildingApplicationModel buildingApplicationModel, NewInvoicePaymentRequestModel invoicePaymentRequest)
    {
        var invoiceContact = await GetOrCreateInvoiceContactAsync(invoicePaymentRequest);
        var dynamicsApplication = await GetBuildingApplicationUsingId(buildingApplicationModel.Id);

        var dynamicsPayment = await CreateInvoicePayment(dynamicsApplication.bsr_buildingapplicationid, invoiceContact, invoicePaymentRequest);
        await UpdateBuildingApplication(dynamicsApplication, new DynamicsBuildingApplication { bsr_applicationstage = BuildingApplicationStage.InvoiceRaised });
        var invoicePaymentResponse = await SendCreateInvoiceRequest(buildingApplicationModel, invoicePaymentRequest, dynamicsPayment, invoiceContact);

        await UpdateInvoicePayment(dynamicsPayment.bsr_paymentid, invoicePaymentResponse);
    }

    private async Task<InvoiceData> SendCreateInvoiceRequest(BuildingApplicationModel buildingApplicationModel, NewInvoicePaymentRequestModel invoicePaymentRequest, DynamicsPayment dynamicsPayment, DynamicsContact invoiceContact)
    {
        return await integrationsOptions.CommonAPIEndpoint.AppendPathSegments("api", "CreateInvoice")
            .WithHeader("x-functions-key", integrationsOptions.CommonAPIKey)
            .AllowAnyHttpStatus()
            .PostJsonAsync(new CreateInvoiceRequest
            {
                Amount = Math.Round((float)integrationsOptions.PaymentAmount / 100, 2),
                PaymentId = dynamicsPayment.bsr_paymentid,
                Name = invoicePaymentRequest.Name,
                Email = invoicePaymentRequest.Email,
                AddressLine1 = invoicePaymentRequest.AddressLine1,
                AddressLine2 = invoicePaymentRequest.AddressLine2,
                Town = invoicePaymentRequest.Town,
                Postcode = invoicePaymentRequest.Postcode,
                Application = "hrbportal",
                Description = $"Building: {buildingApplicationModel.BuildingName}\nApplication: {buildingApplicationModel.Id}",
                Title = "Building Registration",
                OrderNumber = invoicePaymentRequest.OrderNumber,
                CustomerId = invoiceContact.contactid.ToUpper(),
                Environment = integrationsOptions.Environment
            }).ReceiveJson<InvoiceData>();
    }

    private async Task<DynamicsContact> GetOrCreateInvoiceContactAsync(NewInvoicePaymentRequestModel invoicePaymentRequest)
    {
        var splitName = invoicePaymentRequest.Name.Split(' ');
        var lastName = string.Join(' ', splitName.Skip(1));
        var invoiceContact = await FindContactAsync(splitName[0], lastName, invoicePaymentRequest.Email);
        if (invoiceContact == null)
        {
            var response = await dynamicsApi.Create("contacts",
                new DynamicsContact
                {
                    firstname = splitName[0],
                    lastname = lastName,
                    emailaddress1 = invoicePaymentRequest.Email,
                    address1_line1 = invoicePaymentRequest.AddressLine1,
                    address1_line2 = invoicePaymentRequest.AddressLine2,
                    address1_postalcode = invoicePaymentRequest.Postcode,
                    address1_city = invoicePaymentRequest.Town
                }, true);

            invoiceContact = await response.GetJsonAsync<DynamicsContact>();
        }

        return invoiceContact;
    }

    private async Task<DynamicsPayment> CreateInvoicePayment(string buildingApplicationId, DynamicsContact invoicedContact, NewInvoicePaymentRequestModel invoiceData)
    {
        var response = await dynamicsApi.Create("bsr_payments", new DynamicsPayment
        {
            bsr_invoicedcontactid = $"/contacts({invoicedContact.contactid})",
            buildingApplicationReferenceId = $"/bsr_buildingapplications({buildingApplicationId})",
            bsr_paymenttypecode = 760_810_001, // Invoice
            bsr_service = "HRB Registration",
            bsr_billingaddress = string.Join(", ", new[] { invoiceData.AddressLine1, invoiceData.AddressLine2, invoiceData.Postcode, invoiceData.Town }.Where(x => !string.IsNullOrWhiteSpace(x))),
            bsr_amountpaid = Math.Round(integrationsOptions.PaymentAmount / 100, 2),
            bsr_purchaseordernumberifsupplied = invoiceData.OrderNumber,
            bsr_govukpaystatus = "open",
            bsr_emailaddress = invoiceData.Email
        }, true);

        return await response.GetJsonAsync<DynamicsPayment>();
    }

    private async Task UpdateInvoicePayment(string dynamicsPaymentId, InvoiceData invoiceData)
    {
        await dynamicsApi.Update($"bsr_payments({dynamicsPaymentId})",
            new DynamicsPayment
            {
                bsr_invoicenumber = invoiceData.InvoiceNumber,
                bsr_invoicecreationdate = UnixTimeStampToDateTime(invoiceData.CreatedDate).ToString(CultureInfo.InvariantCulture),
                bsr_transactionid = invoiceData.InvoiceId,
                bsr_govukpaystatus = invoiceData.Status
            });
    }

    public async Task UpdateInvoicePayment(InvoicePaidEventData invoicePaidEventData)
    {
        var dynamicsPaymentId = invoicePaidEventData.Data.InvoiceData.InvoiceMetadata.PaymentId;
        var invoiceData = invoicePaidEventData.Data.InvoiceData;

        var dynamicsPayment = new DynamicsPayment
        {
            bsr_govukpaystatus = invoiceData.Status == "paid" ? "success" : invoiceData.Status,
            bsr_timeanddateoftransaction = DateTime.UtcNow.ToString(CultureInfo.InvariantCulture)
        };

        if (invoiceData.Status == "paid")
        {
            dynamicsPayment = dynamicsPayment with { bsr_paymentreconciliationstatus = DynamicsPaymentReconciliationStatus.Successful };
        }

        await dynamicsApi.Update($"bsr_payments({dynamicsPaymentId})", dynamicsPayment);
    }

    public async Task<DynamicsPayment> GetPaymentByReference(string reference)
    {
        var payments = await dynamicsApi.Get<DynamicsResponse<DynamicsPayment>>("bsr_payments", ("$filter", $"bsr_transactionid eq '{reference}'"));
        return payments.value.FirstOrDefault();
    }

    private async Task<DynamicsAccountablePerson> FindExistingAp(string sectionId, string accountId, string area)
    {
        var existingAreaAp = await dynamicsApi.Get<DynamicsResponse<DynamicsAccountablePerson>>("bsr_accountablepersons",
            new[]
            {
                ("$filter",
                    $"_bsr_independentsection_value eq '{sectionId}' and _bsr_apid_value eq '{accountId}' and _bsr_sectionarea_value eq '{DynamicsSectionArea.Ids[area]}'")
            });

        return existingAreaAp.value.FirstOrDefault();
    }

    public async Task AssignContactType(string contactId, string contactTypeId)
    {
        await dynamicsApi.Create($"contacts({contactId})/bsr_contacttype_contact/$ref",
            new DynamicsContactType { contactTypeReferenceId = $"{dynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_contacttypes({contactTypeId})" });
    }

    private async Task<string> GetOrCreateOrganisationAccount(AccountablePerson accountablePerson, BuildingAddress apAddress)
    {
        var existingAccount = await FindExistingAccountAsync(accountablePerson.OrganisationName, apAddress.Postcode);
        if (existingAccount == null)
        {
            var response = await dynamicsApi.Create("accounts",
                new DynamicsAccount
                {
                    name = accountablePerson.OrganisationName,
                    address1_line1 = string.Join(", ", apAddress.Address.Split(',').Take(3)),
                    address1_line2 = apAddress.AddressLineTwo,
                    address1_city = apAddress.Town,
                    address1_postalcode = apAddress.Postcode,
                    bsr_manualaddress = apAddress.IsManual ? YesNoOption.Yes : YesNoOption.No,
                    countryReferenceId = apAddress.Country is "E" or "W" ? $"/bsr_countries({DynamicsCountryCodes.Ids[apAddress.Country]})" : null,
                    acountTypeReferenceId = $"/bsr_accounttypes({DynamicsAccountType.Ids[$"{accountablePerson.OrganisationType}"]})",
                    bsr_otherorganisationtype = accountablePerson.OrganisationTypeDescription
                });

            return ExtractEntityIdFromHeader(response.Headers);
        }

        return existingAccount.accountid;
    }

    private static readonly DateTime Epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static DateTime UnixTimeToDateTime(string text)
    {
        double seconds = double.Parse(text, CultureInfo.InvariantCulture);
        return Epoch.AddMilliseconds(seconds);
    }

    private async Task CreateStructureCompletionCertificate(SectionModel section, DynamicsStructure dynamicsStructure)
    {
        if (!string.IsNullOrWhiteSpace(section.CompletionCertificateIssuer) || !string.IsNullOrWhiteSpace(section.CompletionCertificateReference))
        {
            var existingCertificate = await dynamicsApi.Get<DynamicsResponse<DynamicsCompletionCertificate>>("bsr_completioncertificates",
                ("$filter",
                    $"bsr_certificatereferencenumber eq '{section.CompletionCertificateReference.EscapeSingleQuote()}' and bsr_issuingorganisation eq '{section.CompletionCertificateIssuer.EscapeSingleQuote()}'"));
            if (!existingCertificate.value.Any())
            {
                var dynamicsValue = new DynamicsCompletionCertificate
                    {
                        bsr_name = string.Join(" - ", new[] { section.CompletionCertificateReference, section.CompletionCertificateIssuer }.Where(x => !string.IsNullOrWhiteSpace(x))),
                        bsr_certificatereferencenumber = section.CompletionCertificateReference,
                        bsr_issuingorganisation = section.CompletionCertificateIssuer,
                        structureReferenceId = $"/bsr_blocks({dynamicsStructure.bsr_blockid})"
                    };

                if (section.CompletionCertificateDate != null && section.CompletionCertificateDate.Length > 0) {
                    var formatedDate = UnixTimeToDateTime(section.CompletionCertificateDate).AddHours(1).ToString("d", CultureInfo.InvariantCulture);
                    dynamicsValue = dynamicsValue with {
                        bsr_certificatecompletiondate = formatedDate
                    };
                }

                var response = await dynamicsApi.Create("bsr_completioncertificates", dynamicsValue, returnObjectResponse: true);

                var certificate = await response.GetJsonAsync<DynamicsCompletionCertificate>();
                await dynamicsApi.Update($"/bsr_blocks({dynamicsStructure.bsr_blockid})",
                    new DynamicsStructure { certificateReferenceId = $"/bsr_completioncertificates({certificate.bsr_completioncertificateid})" });
            }
        }
    }

    private async Task CreateStructureOptionalAddresses(SectionModel section, DynamicsStructure dynamicsStructure)
    {
        var portalAddresses = section.Addresses.Skip(1).ToList();
        var dynamicsAddresses = (await dynamicsApi.Get<DynamicsResponse<DynamicsAddress>>("bsr_addresses",
            ("$filter", $"_bsr_independentsectionid_value eq '{dynamicsStructure.bsr_blockid}' and statuscode eq 1"))).value;

        for (var i = 0; i < portalAddresses.Count; i++)
        {
            var portalAddress = portalAddresses[i];
            var dynamicsAddress = dynamicsAddresses.ElementAtOrDefault(i);
            if (dynamicsAddress == null) // new address
            {
                await dynamicsApi.Create("bsr_addresses",
                    new DynamicsAddress
                    {
                        bsr_line1 = string.Join(", ", portalAddress.Address.Split(',').Take(3)),
                        bsr_line2 = portalAddress.AddressLineTwo,
                        bsr_addresstypecode = AddressType.Other,
                        bsr_city = portalAddress.Town,
                        bsr_postcode = portalAddress.Postcode,
                        bsr_uprn = portalAddress.UPRN,
                        bsr_usrn = portalAddress.USRN,
                        bsr_manualaddress = portalAddress.IsManual ? YesNoOption.Yes : YesNoOption.No,
                        countryReferenceId = portalAddress.Country is "E" or "W" ? $"/bsr_countries({DynamicsCountryCodes.Ids[portalAddress.Country]})" : null,
                        structureReferenceId = $"/bsr_blocks({dynamicsStructure.bsr_blockid})",
                        bsr_postcodeentered = portalAddress.PostcodeEntered
                    });

                continue;
            }

            var isMatch = string.Join(", ", portalAddress.Address.Split(',').Take(3)) == dynamicsAddress.bsr_line1 
                && portalAddress.Postcode == dynamicsAddress.bsr_postcode 
                && NormalisePostcode(portalAddress.PostcodeEntered) == NormalisePostcode(dynamicsAddress.bsr_postcodeentered);
            if (!isMatch) // exists, update
            {
                await dynamicsApi.Update($"bsr_addresses({dynamicsAddress.bsr_addressId})",
                    new DynamicsAddress
                    {
                        bsr_line1 = string.Join(", ", portalAddress.Address.Split(',').Take(3)),
                        bsr_line2 = portalAddress.AddressLineTwo,
                        bsr_addresstypecode = AddressType.Other,
                        bsr_city = portalAddress.Town,
                        bsr_postcode = portalAddress.Postcode,
                        bsr_uprn = portalAddress.UPRN,
                        bsr_usrn = portalAddress.USRN,
                        bsr_manualaddress = portalAddress.IsManual ? YesNoOption.Yes : YesNoOption.No,
                        countryReferenceId = portalAddress.Country is "E" or "W" ? $"/bsr_countries({DynamicsCountryCodes.Ids[portalAddress.Country]})" : null,
                        bsr_postcodeentered = portalAddress.PostcodeEntered
                    });
            }
        }

        if (dynamicsAddresses.Count > portalAddresses.Count) // deleted addresses portal, deactivate on d365
        {
            var toDeactivate = dynamicsAddresses.Skip(portalAddresses.Count);
            foreach (var address in toDeactivate)
            {
                await dynamicsApi.Update($"bsr_addresses({address.bsr_addressId})", new DynamicsAddress { statuscode = 2, statecode = 1 });
            }
        }
    }

    private string NormalisePostcode(string postcode) {
        return postcode.ToLower().Replace(" ", "");
    }

    private async Task<DynamicsStructure> SetYearOfCompletion(SectionModel section, DynamicsStructure dynamicsStructure)
    {
        if (dynamicsStructure.bsr_doyouknowtheblocksexactconstructionyear == ConstructionYearOption.Exact)
        {
            var yearResponse = await dynamicsApi.Get<DynamicsResponse<DynamicsYear>>("bsr_years", ("$filter", $"bsr_name eq '{section.YearOfCompletion}'"));
            var yearId = yearResponse.value.Count > 0 ? yearResponse.value[0].bsr_yearid : "49cbd8c7-30b8-ed11-a37f-0022481b5bf5"; // 1800
            return dynamicsStructure with { exactConstructionYearReferenceId = $"/bsr_years({yearId})" };
        }

        if (dynamicsStructure.bsr_doyouknowtheblocksexactconstructionyear == ConstructionYearOption.YearRange)
        {
            var yearRangeId = DynamicsYearRangeIds.Ids[section.YearOfCompletionRange];
            return dynamicsStructure with { sectionCompletionYearRangeReferenceId = $"/bsr_sectioncompletionyearranges({yearRangeId})" };
        }

        return dynamicsStructure;
    }

    private static DynamicsStructure BuildDynamicsStructure(Structures structures, SectionModel section, DynamicsModelDefinition<Structure, DynamicsStructure> structureDefinition)
    {
        var structure = new Structure(section.Name ?? structures.DynamicsBuildingApplication.bsr_Building?.bsr_name, section.FloorsAbove, section.Height, section.ResidentialUnits,
            section.PeopleLivingInBuilding, section.YearOfCompletionOption, null, null, null, section.Duplicate?.WhyContinue, section.Duplicate?.IsDuplicated ?? false);
        var dynamicsStructure = structureDefinition.BuildDynamicsEntity(structure);

        dynamicsStructure = dynamicsStructure with
        {
            buildingReferenceId = $"/bsr_buildings({structures.DynamicsBuildingApplication._bsr_building_value})",
            buildingApplicationReferenceId = $"/bsr_buildingapplications({structures.DynamicsBuildingApplication.bsr_buildingapplicationid})",
        };

        if (section.Addresses != null && section.Addresses.Length > 0)
        {
            dynamicsStructure = AddPrimaryAddressTo(dynamicsStructure, section);
        }

        if (section.Statecode != null && int.Parse(section.Statecode) == 1)
        {
            dynamicsStructure = AddDeactivateStructure(dynamicsStructure);
        }

        return dynamicsStructure;
    }

    private static DynamicsStructure AddPrimaryAddressTo(DynamicsStructure dynamicsStructure, SectionModel section)
    {
        var primaryAddress = section.Addresses[0];
        return dynamicsStructure with
        {
            bsr_addressline1 = string.Join(", ", primaryAddress.Address.Split(',').Take(3)),
            bsr_addressline2 = primaryAddress.AddressLineTwo,
            bsr_addresstype = AddressType.Primary,
            countryReferenceId = primaryAddress.Country is "E" or "W" ? $"/bsr_countries({DynamicsCountryCodes.Ids[primaryAddress.Country]})" : null,
            bsr_city = primaryAddress.Town,
            bsr_postcode = primaryAddress.Postcode,
            bsr_uprn = primaryAddress.UPRN,
            bsr_usrn = primaryAddress.USRN,
            bsr_manualaddress = primaryAddress.IsManual ? YesNoOption.Yes : YesNoOption.No,
            bsr_localauthorityarea = primaryAddress.AdministrativeArea,
            bsr_classificationcode = primaryAddress.ClassificationCode,
            bsr_postcodeentered = primaryAddress.PostcodeEntered
        };
    }

    private static DynamicsStructure AddDeactivateStructure(DynamicsStructure dynamicsStructure)
    {
        return dynamicsStructure with { statecode = 1, statuscode = 2 };
    }

    private async Task<DynamicsStructure> CreateStructure(DynamicsModelDefinition<Structure, DynamicsStructure> structureDefinition, DynamicsStructure dynamicsStructure,
        string buildingApplicationId)
    {
        var existingStructure = await FindExistingStructureAsync(dynamicsStructure.bsr_name.EscapeSingleQuote(), dynamicsStructure.bsr_postcode, buildingApplicationId);
        if (existingStructure != null)
        {
            dynamicsStructure = dynamicsStructure with { bsr_blockid = existingStructure.bsr_blockid };
            await dynamicsApi.Update($"{structureDefinition.Endpoint}({dynamicsStructure.bsr_blockid})", dynamicsStructure);
            return dynamicsStructure;
        }

        var response = await dynamicsApi.Create(structureDefinition.Endpoint, dynamicsStructure);
        var structureId = ExtractEntityIdFromHeader(response.Headers);
        return dynamicsStructure with { bsr_blockid = structureId };
    }

    public async Task<DynamicsStructure> FindExistingStructureAsync(string name, string postcode, string buildingApplicationId = null)
    {
        var filter = $"bsr_postcode eq '{postcode}'";
        if (!string.IsNullOrEmpty(name))
        {
            filter = $"{filter} and bsr_name eq '{name}'";
        }

        if (!string.IsNullOrEmpty(buildingApplicationId))
        {
            filter = $"{filter} and _bsr_buildingapplicationid_value eq '{buildingApplicationId}'";
        }

        var existingStructure = await dynamicsApi.Get<DynamicsResponse<DynamicsStructure>>("bsr_blocks", ("$filter", filter));
        return existingStructure.value.FirstOrDefault();
    }

    public async Task<DynamicsResponse<IndependentSection>> FindExistingStructureWithAccountablePersonAsync(string postcode)
    {
        return await dynamicsApi.Get<DynamicsResponse<IndependentSection>>("bsr_blocks", new (string, string)[]{
            ("$select", "bsr_name,bsr_blockid,bsr_sectionheightinmetres,bsr_nooffloorsabovegroundlevel,bsr_numberofresidentialunits,bsr_postcode,bsr_addressline1,bsr_addressline2,bsr_city"),
            ("$filter", $"bsr_postcode eq '{postcode}'"),
            ("$expand", $"bsr_BuildingId($select=bsr_name),bsr_BuildingApplicationID($select=bsr_paptype,bsr_applicationstage;$filter=bsr_applicationstage eq 760810003;$expand=bsr_papid_account($select=name,address1_line1,address1_postalcode,address1_city,address1_line2))")
        });
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

    public async Task<DynamicsContact> FindExistingContactAsync(string firstName, string lastName, string email, string phoneNumber)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsContact>>("contacts",
            new[]
            {
                ("$filter",
                    $"firstname eq '{firstName.EscapeSingleQuote()}' and lastname eq '{lastName.EscapeSingleQuote()}' and emailaddress1 eq '{email.EscapeSingleQuote()}' and contains(telephone1, '{phoneNumber.Replace("+", string.Empty).EscapeSingleQuote()}')"),
                ("$expand", "bsr_contacttype_contact")
            });

        return response.value.FirstOrDefault();
    }

    private async Task<DynamicsContact> FindContactAsync(string firstName, string lastName, string email)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsContact>>("contacts",
            ("$filter", $"firstname eq '{firstName.EscapeSingleQuote()}' and lastname eq '{lastName.EscapeSingleQuote()}' and emailaddress1 eq '{email.EscapeSingleQuote()}'"));

        return response.value.FirstOrDefault();
    }

    private async Task<DynamicsAccount> FindExistingAccountAsync(string organisationName, string postcode)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsAccount>>("accounts",
            ("$filter", $"name eq '{organisationName.EscapeSingleQuote()}' and address1_postalcode eq '{postcode}'"));

        return response.value.FirstOrDefault();
    }

    internal async Task<string> GetAuthenticationTokenAsync()
    {
        var response = await $"https://login.microsoftonline.com/{dynamicsOptions.TenantId}/oauth2/token"
            .PostUrlEncodedAsync(new { grant_type = "client_credentials", client_id = dynamicsOptions.ClientId, client_secret = dynamicsOptions.ClientSecret, resource = dynamicsOptions.EnvironmentUrl })
            .ReceiveJson<DynamicsAuthenticationModel>();

        return response.AccessToken;
    }

    public string ExtractEntityIdFromHeader(IReadOnlyNameValueList<string> headers)
    {
        var header = headers.FirstOrDefault(x => x.Name == "OData-EntityId");
        var id = Regex.Match(header.Value, @"\((.+)\)");

        return id.Groups[1].Value;
    }

    public async Task<string> GetSubmissionDate(string applicationNumber)
    {
        var buildingApplication = await GetBuildingApplicationUsingId(applicationNumber);
        return buildingApplication.bsr_submittedon;
    }

    public async Task<string> GetKbiSubmissionDate(string applicationNumber)
    {
        var buildingApplication = await GetBuildingApplicationUsingId(applicationNumber);
        return buildingApplication.bsr_Building.bsr_kbicompletiondate;
    }

    public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
    {
        // Unix timestamp is seconds past epoch
        DateTime dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        dateTime = dateTime.AddSeconds(unixTimeStamp).ToLocalTime();
        return dateTime;
    }

    public async Task UploadFileToSharepoint(SharepointUploadRequestModel requestModel)
    {
        var flowModel = requestModel with { fileName = AddTimeToFileName(requestModel.fileName!) };
        await dynamicsOptions.UploadFileFlowUrl.PostJsonAsync(flowModel).ReceiveJson<NewFlowDocumentResponse>();
    }

    private string AddTimeToFileName(string oldFileName)
    {
        var fileNameOnly = Path.GetFileNameWithoutExtension(oldFileName);
        var fileExtension = Path.GetExtension(oldFileName);
        var newFileNameOnly = $"{fileNameOnly}_{DateTime.UtcNow:s}".Replace(':', '-');

        return $"{newFileNameOnly}{fileExtension}";
    }
}