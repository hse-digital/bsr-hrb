import { Injectable } from "@angular/core";
import { ApNavigationNode, BaseNavigation } from "./navigation";
import { AccountablePersonModel, ApplicationService } from "../application.service";
import { AccountablePersonCheckAnswersComponent } from "src/app/features/application/accountable-person/check-answers/check-answers.component";
import { AccountablePersonComponent } from "src/app/features/application/accountable-person/accountable-person/accountable-person.component";
import { OrganisationTypeComponent } from "src/app/features/application/accountable-person/organisation/organisation-type/organisation-type.component";
import { OrganisationNameComponent } from "src/app/features/application/accountable-person/organisation/organisation-name/organisation-name.component";
import { PrincipleAccountableSelection } from "src/app/features/application/accountable-person/principal/principal.component";
import { PapAddressComponent } from "src/app/features/application/accountable-person/ap-address/pap-address.component";
import { ApAddressComponent } from "src/app/features/application/accountable-person/ap-address/ap-address.component";
import { ApNameComponent } from "src/app/features/application/accountable-person/ap-name/ap-name.component";
import { PapNameComponent } from "src/app/features/application/accountable-person/ap-name/pap-name.component";
import { PapDetailsComponent } from "src/app/features/application/accountable-person/ap-details/pap-details.component";
import { PapWhoAreYouComponent } from "src/app/features/application/accountable-person/organisation/pap-who-are-you/pap-who-are-you.component";
import { ActingForAddressComponent } from "src/app/features/application/accountable-person/organisation/acting-for-address/acting-for-address.component";
import { LeadNameComponent } from "src/app/features/application/accountable-person/organisation/lead-name/lead-name.component";
import { LeadDetailsComponent } from "src/app/features/application/accountable-person/organisation/lead-details/lead-details.component";
import { PapNamedRoleComponent } from "src/app/features/application/accountable-person/organisation/pap-named-role/pap-named-role.component";
import { AddAccountablePersonComponent } from "src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component";

@Injectable({ providedIn: 'root' })
export class AccountablePersonNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private CheckAnswersNavigationNode = new CheckAnswersNavigationNode();
  private AccountabilityNotAllocatedNavigationNode = new AccountabilityNotAllocatedNavigationNode(this.CheckAnswersNavigationNode);
  private PapAccountabilityNavigationNode = new PapAccountabilityNavigationNode(this.applicationService, this.AccountabilityNotAllocatedNavigationNode, this.CheckAnswersNavigationNode);
  private AddAnotherApNavigationTree = new AddAnotherApNavigationTree(this.PapAccountabilityNavigationNode);
  private PapLeadContactDetailsNavigationNode = new PapLeadContactDetailsNavigationNode(this.AddAnotherApNavigationTree);
  private PapLeadContactNameNavigationNode = new PapLeadContactNameNavigationNode(this.PapLeadContactDetailsNavigationNode);
  private PapRegisteringForAddressNavigationNode = new PapRegisteringForAddressNavigationNode(this.PapLeadContactNameNavigationNode);
  private PapLeadContactJobRoleNavigationNode = new PapLeadContactJobRoleNavigationNode(this.AddAnotherApNavigationTree);
  private ActingForSameAddressComponentNavigation = new ActingForSameAddressComponentNavigation(this.PapRegisteringForAddressNavigationNode);
  private OrganisationPapRoleNavigationNode = new OrganisationPapRoleNavigationNode(this.ActingForSameAddressComponentNavigation, this.PapLeadContactNameNavigationNode, this.PapLeadContactJobRoleNavigationNode);
  private PapAddressNavigationNode = new PapAddressNavigationNode(this.OrganisationPapRoleNavigationNode, this.AddAnotherApNavigationTree);
  private PapDetailsNavigationNode = new PapDetailsNavigationNode(this.PapAddressNavigationNode);
  private PapNameNavigationNode = new PapNameNavigationNode(this.PapDetailsNavigationNode);
  private YourAddressNavigationNode = new YourAddressNavigationNode(this.PapNameNavigationNode, this.AddAnotherApNavigationTree);
  private OrganisationNameNavigationNode = new OrganisationNameNavigationNode(this.PapAddressNavigationNode, undefined);
  private OrganisationTypeNavigationNode = new OrganisationTypeNavigationNode(this.OrganisationNameNavigationNode);
  private AreYouThePapNavigationNode = new AreYouThePapNavigationNode(this.YourAddressNavigationNode);
  private WhoIsPapNavigationNode = new WhoIsPapNavigationNode(this.applicationService, this.OrganisationTypeNavigationNode, this.AreYouThePapNavigationNode);

  override getNextRoute(): string {
    for (let apIndex = 0; apIndex < this.applicationService.model.AccountablePersons.length; apIndex++) {
      let ap = this.applicationService.model.AccountablePersons[apIndex];
      let apRoute = this.WhoIsPapNavigationNode.getNextRoute(ap, apIndex);

      if (!apRoute || apRoute == AccountablePersonCheckAnswersComponent.route) {
        continue;
      }

      return `accountable-persons/accountable-person-${apIndex + 1}/${apRoute}`;
    }

    return `accountable-persons/${AccountablePersonCheckAnswersComponent.route}`;
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
    private AddAnotherApNavigationTree: AddAnotherApNavigationTree) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (apIndex == 0 && !ap.PapAddress) {
      return PapAddressComponent.route;
    }

    if (ap.IsPrincipal == 'yes') {
      return this.AddAnotherApNavigationTree.getNextRoute(ap, apIndex);
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
    private AddAnotherApNavigationTree: AddAnotherApNavigationTree) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.PapAddress) {
      return PapAddressComponent.route;
    }

    if (ap.Type == 'organisation') {
      return this.OrganisationPapRoleNavigationNode.getNextRoute(ap, apIndex);
    }

    return this.AddAnotherApNavigationTree.getNextRoute(ap, apIndex);
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
  constructor(private PapRegisteringForAddressNavigationNode: PapRegisteringForAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.ActingForSameAddress) {
      return ActingForAddressComponent.route;
    }

    return this.PapRegisteringForAddressNavigationNode.getNextRoute(ap, apIndex);
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
  constructor(private AddAnotherApNavigationTree: AddAnotherApNavigationTree) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.LeadPhoneNumber || !ap.LeadEmail || !ap.LeadJobRole) {
      return LeadDetailsComponent.route;
    }

    return this.AddAnotherApNavigationTree.getNextRoute(ap, apIndex);
  }
}

class PapLeadContactJobRoleNavigationNode extends ApNavigationNode {
  constructor(private AddAnotherApNavigationTree: AddAnotherApNavigationTree) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.LeadJobRole) {
      return PapNamedRoleComponent.route;
    }

    return this.AddAnotherApNavigationTree.getNextRoute(ap, apIndex);
  }
}

class AddAnotherApNavigationNode extends ApNavigationNode {
  constructor(private PapAccountabilityNavigationNode: PapAccountabilityNavigationNode,
    private ApTypeNavigationNode: ApTypeNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    if (!ap.AddAnother) {
      return AddAccountablePersonComponent.route;
    }

    if (ap.AddAnother == 'yes') {
      return this.ApTypeNavigationNode.getNextRoute(ap, apIndex);
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
    return '';
  }
}

class ApTypeNavigationNode extends ApNavigationNode {
  constructor(private OrganisationTypeNavigationNode: OrganisationTypeNavigationNode,
    private ApNameNavigationNode: ApNameNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}

class AccountabilityNotAllocatedNavigationNode extends ApNavigationNode {
  constructor(private CheckAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}
class ApNameNavigationNode extends ApNavigationNode {
  constructor(private ApDetailsNavigationNode: ApDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}

class ApDetailsNavigationNode extends ApNavigationNode {
  constructor(private ApAddressNavigationNode: ApAddressNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}

class ApAddressNavigationNode extends ApNavigationNode {
  constructor(private ApAccountabilityNavigationNode: ApAccountabilityNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}

class ApAccountabilityNavigationNode extends ApNavigationNode {
  constructor(private ApNamedContactNameNavigationNode: ApNamedContactNameNavigationNode,
    private AddAnotherApNavigationTree: AddAnotherApNavigationTree) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}

class ApNamedContactNameNavigationNode extends ApNavigationNode {
  constructor(private ApNamedContactDetailsNavigationNode: ApNamedContactDetailsNavigationNode) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}

class ApNamedContactDetailsNavigationNode extends ApNavigationNode {
  constructor(private AddAnotherApNavigationTree: AddAnotherApNavigationTree) {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}

class CheckAnswersNavigationNode extends ApNavigationNode {
  constructor() {
    super();
  }

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    throw new Error("Method not implemented.");
  }
}

class AddAnotherApNavigationTree extends ApNavigationNode {
  constructor(private PapAccountabilityNavigationNode: PapAccountabilityNavigationNode) {
    super();
  }

  private ApNamedContactDetailsNavigationNode = new ApNamedContactDetailsNavigationNode(this);
  private ApNamedContactNameNavigationNode = new ApNamedContactNameNavigationNode(this.ApNamedContactDetailsNavigationNode);
  private ApAccountabilityNavigationNode = new ApAccountabilityNavigationNode(this.ApNamedContactNameNavigationNode, this);
  private ApAddressNavigationNode = new ApAddressNavigationNode(this.ApAccountabilityNavigationNode);
  private ApDetailsNavigationNode = new ApDetailsNavigationNode(this.ApAddressNavigationNode);
  private ApNameNavigationNode = new ApNameNavigationNode(this.ApDetailsNavigationNode);
  private OrganisationNameNavigationNode = new OrganisationNameNavigationNode(undefined, this.ApAddressNavigationNode);
  private OrganisationTypeNavigationNode = new OrganisationTypeNavigationNode(this.OrganisationNameNavigationNode);
  private ApTypeNavigationNode = new ApTypeNavigationNode(this.OrganisationTypeNavigationNode, this.ApNameNavigationNode);
  private AddAnotherApNavigationNode = new AddAnotherApNavigationNode(this.PapAccountabilityNavigationNode, this.ApTypeNavigationNode);

  override getNextRoute(ap: AccountablePersonModel, apIndex: number): string {
    return this.AddAnotherApNavigationNode.getNextRoute(ap, apIndex);
  }

}