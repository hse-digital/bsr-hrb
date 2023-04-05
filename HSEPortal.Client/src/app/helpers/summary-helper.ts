import { AccountablePersonModel } from "../services/application.service";
import { FieldValidations } from "./validators/fieldvalidations";

export class SummaryComponent {
  protected ap!: AccountablePersonModel;
  protected apIndex!: number;
  protected hasMoreAp = false;

  get whoAreYouDescription() {
    return SummaryTextValueMapper.whoAreYouDescription[this.ap.Role ?? ""];
  }

  get useSameAddressDescription() {
    return SummaryTextValueMapper.useSameAddressDescription[this.ap.ActingForSameAddress ?? ""]
  }

  get organisationTypeDescription() {
    let organisationType = SummaryTextValueMapper.organisationTypeDescription[this.ap.OrganisationType ?? ""];

    return FieldValidations.IsNotNullOrWhitespace(organisationType)
      ? organisationType
      : this.ap.OrganisationTypeDescription;
  }

  get leadJobRoleDescription() {
    return SummaryTextValueMapper.leadJobRoleDescription[this.ap.LeadJobRole ?? ""];
  }

  get apAddress() {
    return this.ap.PapAddress ?? this.ap.Address;
  }

  getYourAddress() {
    return this.apIndex == 0 && this.ap.IsPrincipal == 'yes' ?
      this.ap.PapAddress : this.ap.Address;
  }

  getPapAddress() {
    return this.apIndex == 0 && this.ap.IsPrincipal == 'no' ?
      this.ap.PapAddress : this.ap.Address;
  }

  sectionsWithAccountability() {
    return this.ap.SectionsAccountability?.filter(x => x.Accountability?.length ?? 0 > 0);
  }

  _accountabilityDescription(value: string) {
    let accountabilityDescription = SummaryTextValueMapper._accountabilityDescription[value];
    return FieldValidations.IsNotNullOrWhitespace(accountabilityDescription)
      ? accountabilityDescription
      : 'Facilities that residents share';
  }

  notPap() {
    return this.ap.IsPrincipal == 'no';
  }

  isRegisteringFor() {
    return this.ap.Role == 'registering_for';
  }

  isNamedContact() {
    return this.ap.Role == 'named_contact';
  }

  isEmployee() {
    return this.ap.Role == 'employee';
  }

}

type Mapper = Record<string, string>;

class SummaryTextValueMapper {

  static readonly whoAreYouDescription: Mapper = {
    "named_contact": "I am the named contact",
    "registering_for": "I am registering for the named contact",
    "employee": "I am an employee"
  };

  static readonly useSameAddressDescription: Mapper = {
    "yes": "Yes, use the same address",
    "no": "No, use a different address"
  }

  static readonly organisationTypeDescription: Mapper = {
    "commonhold-association": "Commonhold association",
    "housing-association": "Housing association or other company operating under section 27 of the Housing Act 1985",
    "local-authority": "Local authority",
    "management-company": "Management company",
    "rmc-or-organisation": "Resident management company (RMC) or organisation",
    "rtm-or-organisation": "Right to manage (RTM) company or organisation"
  }

  static readonly leadJobRoleDescription: Mapper = {
    "director": "Director",
    "administrative_worker": "Administrative or office worker",
    "building_manager": "Building or facilities manager",
    "building_director": "Building safety director",
    "other": "Other"
  }

  static readonly _accountabilityDescription: Mapper = {
    "external_walls": "External walls and roof",
    "routes": "Routes that residents can walk through",
    "maintenance": "Maintaining plant and equipment"
  }

}
