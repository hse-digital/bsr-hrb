import { Injectable } from "@angular/core";
import { ApNavigationNode, BaseNavigation } from "../../../services/navigation";
import { AccountablePersonModel, ApplicationService } from "../../../services/application.service";
import { AccountablePersonCheckAnswersComponent } from "./check-answers/check-answers.component";
import { AccountablePersonComponent } from "./accountable-person/accountable-person.component";
import { OrganisationTypeComponent } from "./organisation/organisation-type/organisation-type.component";
import { OrganisationNameComponent } from "./organisation/organisation-name/organisation-name.component";
import { PrincipleAccountableSelection } from "./principal/principal.component";
import { PapAddressComponent } from "./ap-address/pap-address.component";
import { PapNameComponent } from "./ap-name/pap-name.component";
import { PapDetailsComponent } from "./ap-details/pap-details.component";
import { PapWhoAreYouComponent } from "./organisation/pap-who-are-you/pap-who-are-you.component";
import { ActingForAddressComponent } from "./organisation/acting-for-address/acting-for-address.component";
import { LeadNameComponent } from "./organisation/lead-name/lead-name.component";
import { LeadDetailsComponent } from "./organisation/lead-details/lead-details.component";
import { PapNamedRoleComponent } from "./organisation/pap-named-role/pap-named-role.component";
import { AddAccountablePersonComponent } from "./add-accountable-person/add-accountable-person.component";
import { AreasAccountabilityComponent } from "./areas-accountability/areas-accountability.component";
import { AccountablePersonTypeComponent } from "./add-accountable-person/accountable-person-type.component";
import { ApNameComponent } from "./ap-name/ap-name.component";
import { ApDetailsComponent } from "./ap-details/ap-details.component";
import { ApAddressComponent } from "./ap-address/ap-address.component";
import { ApAccountableForComponent } from "./accountable-for/accountable-for.component";
import { OrganisationNamedContactComponent } from "./organisation/named-contact/named-contact.component";
import { OrganisationNamedContactDetailsComponent } from "./organisation/named-contact/named-contact-details.component";
import { AccountablePersonModule } from "./accountable-person.module";
import { ActingForSameAddressComponent } from "./organisation/acting-for-same-address/acting-for-same-address.component";
import { AccountabilityAreasHelper } from "src/app/helpers/accountability-areas-helper";
import { NotAllocatedAccountabilityAreasComponent } from "./not-allocated-accountability-areas/not-allocated-accountability-areas.component";

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
        console.log('0');
        apRoute = this.PapNavigationTree.getNextRoute(ap, apIndex);
      } else {
        console.log('0.1');
        apRoute = this.OtherApNavigationTree.getNextRoute(ap, apIndex);
      }

      console.log({ apRoute, apIndex, ap });

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
    console.log('1');
    if (!this.applicationService.model.PrincipalAccountableType) {
      console.log('1.1');
      return AccountablePersonComponent.route;
    }

    if (ap.Type == 'organisation') {
      console.log('1.2');
      return this.OrganisationTypeNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('1.3');
    return this.AreYouThePapNavigationNode.getNextRoute(ap, apIndex);
  }
}

class OrganisationTypeNavigationNode extends ApNavigationNode {
  constructor(private OrganisationNameNavigationNode: OrganisationNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('2');
    if (!ap.OrganisationType) {
      console.log('2.1');
      return OrganisationTypeComponent.route;
    }

    console.log('2.2');
    return this.OrganisationNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class OrganisationNameNavigationNode extends ApNavigationNode {
  constructor(private PapAddressNavigationNode?: PapAddressNavigationNode,
    private ApAddressNavigationNode?: ApAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('3');
    if (!ap.OrganisationName) {
      console.log('3.1');
      return OrganisationNameComponent.route;
    }

    if (apIndex == 0) {
      console.log('3.2');
      return this.PapAddressNavigationNode!.getNextRoute(ap, apIndex);
    }

    console.log('3.3');
    return this.ApAddressNavigationNode!.getNextRoute(ap, apIndex);
  }
}

class AreYouThePapNavigationNode extends ApNavigationNode {
  constructor(private YourAddressNavigationNode: YourAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('4');
    if (!ap.IsPrincipal) {
      console.log('4.1');
      return PrincipleAccountableSelection.route;
    }

    console.log('4.2');
    return this.YourAddressNavigationNode.getNextRoute(ap, apIndex);
  }
}

class YourAddressNavigationNode extends ApNavigationNode {
  constructor(private PapNameNavigationNode: PapNameNavigationNode,
    private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('5');
    if (apIndex == 0 && !ap.PapAddress && !ap.Address) {
      console.log('5.1');
      return ApAddressComponent.route;
    }

    if (ap.IsPrincipal == 'yes') {
      console.log('5.2');
      return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('5.3');
    return this.PapNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapNameNavigationNode extends ApNavigationNode {
  constructor(private PapDetailsNavigationNode: PapDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('6');
    if (!ap.FirstName || !ap.LastName) {
      console.log('6.1');
      return PapNameComponent.route;
    }

    console.log('6.2');
    return this.PapDetailsNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapDetailsNavigationNode extends ApNavigationNode {
  constructor(private PapAddressNavigationNode: PapAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('7');
    if (!ap.PhoneNumber || !ap.Email) {
      console.log('7.1');
      return PapDetailsComponent.route;
    }

    console.log('7.2');
    return this.PapAddressNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapAddressNavigationNode extends ApNavigationNode {
  constructor(private OrganisationPapRoleNavigationNode: OrganisationPapRoleNavigationNode,
    private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('8');
    if (!ap.PapAddress) {
      console.log('8.1');
      return PapAddressComponent.route;
    }

    if (ap.Type == 'organisation') {
      console.log('8.2');
      return this.OrganisationPapRoleNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('8.3');
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
    console.log('9');
    if (!ap.Role) {
      console.log('9.1');
      return PapWhoAreYouComponent.route;
    }

    if (ap.Role == 'named_contact') {
      console.log('9.2');
      return this.PapLeadContactJobRoleNavigationNode.getNextRoute(ap, apIndex);
    }

    if (ap.Role == 'employee') {
      console.log('9.3');
      return this.PapLeadContactNameNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('9.4');
    return this.ActingForSameAddressComponentNavigation.getNextRoute(ap, apIndex);
  }
}

class ActingForSameAddressComponentNavigation extends ApNavigationNode {
  constructor(private PapRegisteringForAddressNavigationNode: PapRegisteringForAddressNavigationNode,
    private PapLeadContactNameNavigationNode: PapLeadContactNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('10');
    if (!ap.ActingForSameAddress) {
      console.log('10.1');
      return ActingForSameAddressComponent.route;
    }

    if (ap.ActingForSameAddress == 'no') {
      console.log('10.2');
      return this.PapRegisteringForAddressNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('10.3');
    return this.PapLeadContactNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapRegisteringForAddressNavigationNode extends ApNavigationNode {
  constructor(private PapLeadContactNameNavigationNode: PapLeadContactNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('11');
    if (!ap.ActingForAddress) {
      console.log('11.1');
      return ActingForAddressComponent.route;
    }

    console.log('11.2');
    return this.PapLeadContactNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapLeadContactNameNavigationNode extends ApNavigationNode {
  constructor(private PapLeadContactDetailsNavigationNode: PapLeadContactDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('12');
    if (!ap.LeadFirstName || !ap.LeadLastName) {
      console.log('12.1');
      return LeadNameComponent.route;
    }

    console.log('12.2');
    return this.PapLeadContactDetailsNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapLeadContactDetailsNavigationNode extends ApNavigationNode {
  constructor(private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('13');
    if (!ap.LeadPhoneNumber || !ap.LeadEmail || !ap.LeadJobRole) {
      console.log('13.1');
      return LeadDetailsComponent.route;
    }

    console.log('13.2');
    return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
  }
}

class PapLeadContactJobRoleNavigationNode extends ApNavigationNode {
  constructor(private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('14');
    if (!ap.LeadJobRole) {
      console.log('14.1');
      return PapNamedRoleComponent.route;
    }

    console.log('14.2');
    return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
  }
}

class AddAnotherApNavigationNode extends ApNavigationNode {
  constructor(private PapAccountabilityNavigationNode: PapAccountabilityNavigationNode,
    private CheckAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('15');
    if (!ap.AddAnother) {
      console.log('15.1');
      return AddAccountablePersonComponent.route;
    }

    if (ap.AddAnother == 'yes') {
      console.log('15.2');
      return this.CheckAnswersNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('15.3');
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
    console.log('16');
    var pap = this.applicationService.model.AccountablePersons[0];
    if (pap.SectionsAccountability == null || pap.SectionsAccountability.length == 0 || pap.SectionsAccountability.flatMap(x => x.Accountability)?.length == 0) {
      console.log('16.1');
      return AreasAccountabilityComponent.route;
    }

    let thereAreNotAllocatedAreas = this.applicationService.model.Sections.some(x => AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService, x).length > 0);
    if (thereAreNotAllocatedAreas) {
      console.log('16.2');
      return this.AccountabilityNotAllocatedNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('16.3');
    return this.CheckAnswersNavigationNode.getNextRoute(ap, apIndex);
  }
}

class AccountabilityNotAllocatedNavigationNode extends ApNavigationNode {
  constructor(private applicationService: ApplicationService,
    private CheckAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('17');
    let thereAreNotAllocatedAreas = this.applicationService.model.Sections.some(x => AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService, x).length > 0);
    if (thereAreNotAllocatedAreas) {
      console.log('17.1');
      return NotAllocatedAccountabilityAreasComponent.route;
    }

    console.log('17.2');
    return this.CheckAnswersNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApTypeNavigationNode extends ApNavigationNode {
  constructor(private OrganisationTypeNavigationNode: OrganisationTypeNavigationNode,
    private ApNameNavigationNode: ApNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('18');
    if (!ap.Type) {
      console.log('18.1');
      return AccountablePersonTypeComponent.route;
    }

    if (ap.Type == 'organisation') {
      console.log('18.2');
      return this.OrganisationTypeNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('18.3');
    return this.ApNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApNameNavigationNode extends ApNavigationNode {
  constructor(private ApDetailsNavigationNode: ApDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('19');
    if (!ap.FirstName || !ap.LastName) {
      console.log('19.1');
      return ApNameComponent.route;
    }

    console.log('19.2');
    return this.ApDetailsNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApDetailsNavigationNode extends ApNavigationNode {
  constructor(private ApAddressNavigationNode: ApAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('20');
    if (!ap.PhoneNumber || !ap.Email) {
      console.log('20.1');
      return ApDetailsComponent.route;
    }

    console.log('20.2');
    return this.ApAddressNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApAddressNavigationNode extends ApNavigationNode {
  constructor(private ApAccountabilityNavigationNode: ApAccountabilityNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('21');
    if (!ap.Address && !ap.PapAddress) {
      console.log('21.1');
      return ApAddressComponent.route;
    }

    console.log('21.2');
    return this.ApAccountabilityNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApAccountabilityNavigationNode extends ApNavigationNode {
  constructor(private ApNamedContactNameNavigationNode: ApNamedContactNameNavigationNode,
    private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('22');
    if (ap.SectionsAccountability == null || ap.SectionsAccountability.length == 0 || ap.SectionsAccountability.flatMap(x => x.Accountability)?.length == 0) {
      console.log('22.1');
      return ApAccountableForComponent.route;
    }

    if (ap.Type == 'individual') {
      console.log('22.2');
      return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
    }

    console.log('22.3');
    return this.ApNamedContactNameNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApNamedContactNameNavigationNode extends ApNavigationNode {
  constructor(private ApNamedContactDetailsNavigationNode: ApNamedContactDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('23');
    if (!ap.NamedContactFirstName || !ap.NamedContactLastName) {
      console.log('23.1');
      return OrganisationNamedContactComponent.route;
    }

    console.log('23.2');
    return this.ApNamedContactDetailsNavigationNode.getNextRoute(ap, apIndex);
  }
}

class ApNamedContactDetailsNavigationNode extends ApNavigationNode {
  constructor(private AddAnotherApNavigationNode: AddAnotherApNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    console.log('24');
    if (!ap.NamedContactPhoneNumber || !ap.NamedContactEmail) {
      console.log('24.1');
      return OrganisationNamedContactDetailsComponent.route;
    }

    console.log('24.2');
    return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
  }
}

class CheckAnswersNavigationNode extends ApNavigationNode {
  constructor() {
    super();
  }

  override getNextRoute(_: AccountablePersonModel, __: number): string {
    console.log('25');
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
    console.log('26');
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
    console.log('27');
    return this.WhoIsPapNavigationNode.getNextRoute(ap, apIndex);
  }
} 