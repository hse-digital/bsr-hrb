import { Injectable } from "@angular/core";
import { ApNavigationNode, BaseNavigation } from "./navigation";
import { AccountablePersonModel, ApplicationService } from "../application.service";
import { AccountablePersonCheckAnswersComponent } from "src/app/features/application/accountable-person/check-answers/check-answers.component";
import { AccountablePersonComponent } from "src/app/features/application/accountable-person/accountable-person/accountable-person.component";
import { OrganisationTypeComponent } from "src/app/features/application/accountable-person/organisation/organisation-type/organisation-type.component";
import { OrganisationNameComponent } from "src/app/features/application/accountable-person/organisation/organisation-name/organisation-name.component";
import { PrincipleAccountableSelection } from "src/app/features/application/accountable-person/principal/principal.component";
import { PapAddressComponent } from "src/app/features/application/accountable-person/ap-address/pap-address.component";
import { PapNameComponent } from "src/app/features/application/accountable-person/ap-name/pap-name.component";
import { PapDetailsComponent } from "src/app/features/application/accountable-person/ap-details/pap-details.component";
import { PapWhoAreYouComponent } from "src/app/features/application/accountable-person/organisation/pap-who-are-you/pap-who-are-you.component";
import { ActingForAddressComponent } from "src/app/features/application/accountable-person/organisation/acting-for-address/acting-for-address.component";
import { LeadNameComponent } from "src/app/features/application/accountable-person/organisation/lead-name/lead-name.component";
import { LeadDetailsComponent } from "src/app/features/application/accountable-person/organisation/lead-details/lead-details.component";
import { PapNamedRoleComponent } from "src/app/features/application/accountable-person/organisation/pap-named-role/pap-named-role.component";
import { AddAccountablePersonComponent } from "src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component";
import { AreasAccountabilityComponent } from "src/app/features/application/accountable-person/areas-accountability/areas-accountability.component";
import { AccountablePersonTypeComponent } from "src/app/features/application/accountable-person/add-accountable-person/accountable-person-type.component";
import { ApNameComponent } from "src/app/features/application/accountable-person/ap-name/ap-name.component";
import { ApDetailsComponent } from "src/app/features/application/accountable-person/ap-details/ap-details.component";
import { ApAddressComponent } from "src/app/features/application/accountable-person/ap-address/ap-address.component";
import { ApAccountableForComponent } from "src/app/features/application/accountable-person/accountable-for/accountable-for.component";
import { OrganisationNamedContactComponent } from "src/app/features/application/accountable-person/organisation/named-contact/named-contact.component";
import { OrganisationNamedContactDetailsComponent } from "src/app/features/application/accountable-person/organisation/named-contact/named-contact-details.component";
import { AccountablePersonModule } from "src/app/features/application/accountable-person/accountable-person.module";
import { ActingForSameAddressComponent } from "src/app/features/application/accountable-person/organisation/acting-for-same-address/acting-for-same-address.component";
import { AccountabilityAreasHelper } from "src/app/helpers/accountability-areas-helper";
import { NotAllocatedAccountabilityAreasComponent } from "src/app/features/application/accountable-person/not-allocated-accountability-areas/not-allocated-accountability-areas.component";

@Injectable()
export class AccountablePersonNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private CheckAnswersNavigationNode = new CheckAnswersNavigationNode();
  private AccountabilityNotAllocatedNavigationNode = new AccountabilityNotAllocatedNavigationNode(this.applicationService, this.CheckAnswersNavigationNode);
  private PapAccountabilityNavigationNode = new PapAccountabilityNavigationNode(this.applicationService, this.AccountabilityNotAllocatedNavigationNode, this.CheckAnswersNavigationNode);
  private AddAnotherApNavigationNode = new AddAnotherApNavigationNode(this.PapAccountabilityNavigationNode, this.CheckAnswersNavigationNode);
  private OtherApNavigationTree = new OtherApNavigationTree(this.AddAnotherApNavigationNode);
  private PapNavigationTree = new PapNavigationTree(this.applicationService, this.AddAnotherApNavigationNode);

  override getNextRoute(): string {
    if (this.applicationService.model.AccountablePersons == null || this.applicationService.model.AccountablePersons.length == 0) {
      return AccountablePersonModule.baseRoute;
    }

    for (let apIndex = 0; apIndex < this.applicationService.model.AccountablePersons.length; apIndex++) {
      let ap = this.applicationService.model.AccountablePersons[apIndex];
      let apRoute: string;
      if (apIndex == 0) {
        apRoute = this.PapNavigationTree.getNextRoute(ap, apIndex);
      } else {
        apRoute = this.OtherApNavigationTree.getNextRoute(ap, apIndex);
      }

      if (apRoute === void 0 || apRoute == AccountablePersonCheckAnswersComponent.route) {
        continue;
      }

      if (apRoute == AddAccountablePersonComponent.route || apRoute == AreasAccountabilityComponent.route || apRoute == NotAllocatedAccountabilityAreasComponent.route) {
        return `accountable-person/${apRoute}`
      }

      return `accountable-person/accountable-person-${apIndex + 1}/${apRoute}`;
    }

    return `accountable-person/${AccountablePersonCheckAnswersComponent.route}`;
  }
}

class WhoIsPapNavigationNode extends ApNavigationNode {
  constructor(private applicationService: ApplicationService,
    private OrganisationTypeNavigationNode: OrganisationTypeNavigationNode,
    private AreYouThePapNavigationNode: AreYouThePapNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!this.applicationService.model.PrincipalAccountableType) {
      return AccountablePersonComponent.route;
    }

    if (ap.Type == 'organisation') {
      return this.OrganisationTypeNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.AreYouThePapNavigationNode.getNextRoute(ap, apIndex);
  }
}

class OrganisationTypeNavigationNode extends ApNavigationNode {
  constructor(private OrganisationNameNavigationNode: OrganisationNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.OrganisationType) {
      return OrganisationTypeComponent.route;
    }

    return this.OrganisationNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class OrganisationNameNavigationNode extends ApNavigationNode {
  constructor(private PapAddressNavigationNode?: PapAddressNavigationNode,
    private ApAddressNavigationNode?: ApAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.OrganisationName) {
      return OrganisationNameComponent.route;
    }

    if (apIndex == 0) {
      return this.PapAddressNavigationNode!.getNextRoute(ap, apIndex);
    }

    return this.ApAddressNavigationNode!.getNextRoute(ap, apIndex);
  }
}

class AreYouThePapNavigationNode extends ApNavigationNode {
  constructor(private YourAddressNavigationNode: YourAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.IsPrincipal) {
      return PrincipleAccountableSelection.route;
    }

    return this.YourAddressNavigationNode.getNextRoute(ap, apIndex);
  }
}

class YourAddressNavigationNode extends ApNavigationNode {
  constructor(private PapNameNavigationNode: PapNameNavigationNode,
    private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (apIndex == 0 && !ap.PapAddress && !ap.Address) {
      return ApAddressComponent.route;
    }

    if (ap.IsPrincipal == 'yes') {
      return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.PapNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapNameNavigationNode extends ApNavigationNode {
  constructor(private PapDetailsNavigationNode: PapDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.FirstName || !ap.LastName) {
      return PapNameComponent.route;
    }

    return this.PapDetailsNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapDetailsNavigationNode extends ApNavigationNode {
  constructor(private PapAddressNavigationNode: PapAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.PhoneNumber || !ap.Email) {
      return PapDetailsComponent.route;
    }

    return this.PapAddressNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapAddressNavigationNode extends ApNavigationNode {
  constructor(private OrganisationPapRoleNavigationNode: OrganisationPapRoleNavigationNode,
    private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.PapAddress) {
      return PapAddressComponent.route;
    }

    if (ap.Type == 'organisation') {
      return this.OrganisationPapRoleNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
  }
}

class OrganisationPapRoleNavigationNode extends ApNavigationNode {
  constructor(private ActingForSameAddressComponentNavigation: ActingForSameAddressComponentNavigation,
    private PapLeadContactNameNavigationNode: PapLeadContactNameNavigationNode,
    private PapLeadContactJobRoleNavigationNode: PapLeadContactJobRoleNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.Role) {
      return PapWhoAreYouComponent.route;
    }

    if (ap.Role == 'named_contact') {
      return this.PapLeadContactJobRoleNavigationNode.getNextRoute(ap, apIndex);
    }

    if (ap.Role == 'employee') {
      return this.PapLeadContactNameNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.ActingForSameAddressComponentNavigation.getNextRoute(ap, apIndex);
  }
}

class ActingForSameAddressComponentNavigation extends ApNavigationNode {
  constructor(private PapRegisteringForAddressNavigationNode: PapRegisteringForAddressNavigationNode,
    private PapLeadContactNameNavigationNode: PapLeadContactNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.ActingForSameAddress) {
      return ActingForSameAddressComponent.route;
    }

    if (ap.ActingForSameAddress == 'no') {
      return this.PapRegisteringForAddressNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.PapLeadContactNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapRegisteringForAddressNavigationNode extends ApNavigationNode {
  constructor(private PapLeadContactNameNavigationNode: PapLeadContactNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.ActingForAddress) {
      return ActingForAddressComponent.route;
    }

    return this.PapLeadContactNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapLeadContactNameNavigationNode extends ApNavigationNode {
  constructor(private PapLeadContactDetailsNavigationNode: PapLeadContactDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.LeadFirstName || !ap.LeadLastName) {
      return LeadNameComponent.route;
    }

    return this.PapLeadContactDetailsNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapLeadContactDetailsNavigationNode extends ApNavigationNode {
  constructor(private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.LeadPhoneNumber || !ap.LeadEmail || !ap.LeadJobRole) {
      return LeadDetailsComponent.route;
    }

    return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapLeadContactJobRoleNavigationNode extends ApNavigationNode {
  constructor(private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.LeadJobRole) {
      return PapNamedRoleComponent.route;
    }

    return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
  }
}

class AddAnotherApNavigationNode extends ApNavigationNode {
  constructor(private PapAccountabilityNavigationNode: PapAccountabilityNavigationNode,
    private CheckAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.AddAnother) {
      return AddAccountablePersonComponent.route;
    }

    if (ap.AddAnother == 'yes') {
      return this.CheckAnswersNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.PapAccountabilityNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapAccountabilityNavigationNode extends ApNavigationNode {
  constructor(private applicationService: ApplicationService,
    private AccountabilityNotAllocatedNavigationNode: AccountabilityNotAllocatedNavigationNode,
    private CheckAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    var pap = this.applicationService.model.AccountablePersons[0];
    if (pap.SectionsAccountability == null || pap.SectionsAccountability.length == 0 || pap.SectionsAccountability.flatMap(x => x.Accountability)?.length == 0) {
      return AreasAccountabilityComponent.route;
    }

    let thereAreNotAllocatedAreas = this.applicationService.model.Sections.some(x => AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService, x).length > 0);
    if (thereAreNotAllocatedAreas) {
      return this.AccountabilityNotAllocatedNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.CheckAnswersNavigationNode.getNextRoute(ap, apIndex);
  }
}

class AccountabilityNotAllocatedNavigationNode extends ApNavigationNode {
  constructor(private applicationService: ApplicationService,
    private CheckAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    let thereAreNotAllocatedAreas = this.applicationService.model.Sections.some(x => AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService, x).length > 0);
    if (thereAreNotAllocatedAreas) {
      return NotAllocatedAccountabilityAreasComponent.route;
    }

    return this.CheckAnswersNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApTypeNavigationNode extends ApNavigationNode {
  constructor(private OrganisationTypeNavigationNode: OrganisationTypeNavigationNode,
    private ApNameNavigationNode: ApNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.Type) {
      return AccountablePersonTypeComponent.route;
    }

    if (ap.Type == 'organisation') {
      return this.OrganisationTypeNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.ApNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApNameNavigationNode extends ApNavigationNode {
  constructor(private ApDetailsNavigationNode: ApDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.FirstName || !ap.LastName) {
      return ApNameComponent.route;
    }

    return this.ApDetailsNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApDetailsNavigationNode extends ApNavigationNode {
  constructor(private ApAddressNavigationNode: ApAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.PhoneNumber || !ap.Email) {
      return ApDetailsComponent.route;
    }

    return this.ApAddressNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApAddressNavigationNode extends ApNavigationNode {
  constructor(private ApAccountabilityNavigationNode: ApAccountabilityNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.Address && !ap.PapAddress) {
      return ApAddressComponent.route;
    }

    return this.ApAccountabilityNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApAccountabilityNavigationNode extends ApNavigationNode {
  constructor(private ApNamedContactNameNavigationNode: ApNamedContactNameNavigationNode,
    private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (ap.SectionsAccountability == null || ap.SectionsAccountability.length == 0 || ap.SectionsAccountability.flatMap(x => x.Accountability)?.length == 0) {
      return ApAccountableForComponent.route;
    }

    if (ap.Type == 'individual') {
      return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.ApNamedContactNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApNamedContactNameNavigationNode extends ApNavigationNode {
  constructor(private ApNamedContactDetailsNavigationNode: ApNamedContactDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.NamedContactFirstName || !ap.NamedContactLastName) {
      return OrganisationNamedContactComponent.route;
    }

    return this.ApNamedContactDetailsNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApNamedContactDetailsNavigationNode extends ApNavigationNode {
  constructor(private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.NamedContactPhoneNumber || !ap.NamedContactEmail) {
      return OrganisationNamedContactDetailsComponent.route;
    }

    return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
  }
}

class CheckAnswersNavigationNode extends ApNavigationNode {
  constructor() {
    super();
  }

  override getNextRoute(_: AccountablePersonModel, __: number): string {
    return AccountablePersonCheckAnswersComponent.route;
  }
}

class OtherApNavigationTree extends ApNavigationNode {
  constructor(private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  private ApNamedContactDetailsNavigationNode = new ApNamedContactDetailsNavigationNode(this.AddAnotherApNavigationNode);
  private ApNamedContactNameNavigationNode = new ApNamedContactNameNavigationNode(this.ApNamedContactDetailsNavigationNode);
  private ApAccountabilityNavigationNode = new ApAccountabilityNavigationNode(this.ApNamedContactNameNavigationNode, this.AddAnotherApNavigationNode);
  private ApAddressNavigationNode = new ApAddressNavigationNode(this.ApAccountabilityNavigationNode);
  private ApDetailsNavigationNode = new ApDetailsNavigationNode(this.ApAddressNavigationNode);
  private ApNameNavigationNode = new ApNameNavigationNode(this.ApDetailsNavigationNode);
  private OrganisationNameNavigationNode = new OrganisationNameNavigationNode(undefined, this.ApAddressNavigationNode);
  private OrganisationTypeNavigationNode = new OrganisationTypeNavigationNode(this.OrganisationNameNavigationNode);
  private ApTypeNavigationNode = new ApTypeNavigationNode(this.OrganisationTypeNavigationNode, this.ApNameNavigationNode);

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    return this.ApTypeNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapNavigationTree extends ApNavigationNode {
  constructor(private applicationService: ApplicationService,
    private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  private PapLeadContactDetailsNavigationNode = new PapLeadContactDetailsNavigationNode(this.AddAnotherApNavigationNode);
  private PapLeadContactNameNavigationNode = new PapLeadContactNameNavigationNode(this.PapLeadContactDetailsNavigationNode);
  private PapRegisteringForAddressNavigationNode = new PapRegisteringForAddressNavigationNode(this.PapLeadContactNameNavigationNode);
  private PapLeadContactJobRoleNavigationNode = new PapLeadContactJobRoleNavigationNode(this.AddAnotherApNavigationNode);
  private ActingForSameAddressComponentNavigation = new ActingForSameAddressComponentNavigation(this.PapRegisteringForAddressNavigationNode, this.PapLeadContactNameNavigationNode);
  private OrganisationPapRoleNavigationNode = new OrganisationPapRoleNavigationNode(this.ActingForSameAddressComponentNavigation, this.PapLeadContactNameNavigationNode, this.PapLeadContactJobRoleNavigationNode);
  private PapAddressNavigationNode = new PapAddressNavigationNode(this.OrganisationPapRoleNavigationNode, this.AddAnotherApNavigationNode);
  private PapDetailsNavigationNode = new PapDetailsNavigationNode(this.PapAddressNavigationNode);
  private PapNameNavigationNode = new PapNameNavigationNode(this.PapDetailsNavigationNode);
  private YourAddressNavigationNode = new YourAddressNavigationNode(this.PapNameNavigationNode, this.AddAnotherApNavigationNode);
  private OrganisationNameNavigationNode = new OrganisationNameNavigationNode(this.PapAddressNavigationNode, undefined);
  private OrganisationTypeNavigationNode = new OrganisationTypeNavigationNode(this.OrganisationNameNavigationNode);
  private AreYouThePapNavigationNode = new AreYouThePapNavigationNode(this.YourAddressNavigationNode);
  private WhoIsPapNavigationNode = new WhoIsPapNavigationNode(this.applicationService, this.OrganisationTypeNavigationNode, this.AreYouThePapNavigationNode);


  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    return this.WhoIsPapNavigationNode.getNextRoute(ap, apIndex);
  }
} 