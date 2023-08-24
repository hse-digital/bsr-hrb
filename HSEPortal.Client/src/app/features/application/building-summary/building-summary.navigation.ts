import { NumberOfSectionsComponment } from "./number-of-sections/number-of-sections.component";
import { ApplicationService, SectionModel } from "../../../services/application.service";
import { BaseNavigation, BuildingNavigationNode } from "../../../services/navigation";
import { SectionsIntroComponent } from "./intro/intro.component";
import { SectionNameComponent } from "./name/name.component";
import { SectionFloorsAboveComponent } from "./floors-above/floors-above.component";
import { SectionHeightComponent } from "./height/height.component";
import { SectionResidentialUnitsComponent } from "./residential-units/residential-units.component";
import { SectionPeopleLivingInBuildingComponent } from "./people-living-in-building/people-living-in-building.component";
import { SectionYearOfCompletionComponent } from "./year-of-completion/year-of-completion.component";
import { SectionYearRangeComponent } from "./year-range/year-range.component";
import { CertificateIssuerComponent } from "./certificate-issuer/certificate-issuer.component";
import { CertificateNumberComponent } from "./certificate-number/certificate-number.component";
import { SectionAddressComponent } from "./address/address.component";
import { SectionCheckAnswersComponent } from "./check-answers/check-answers.component";
import { Injectable } from "@angular/core";
import { AddMoreSectionsComponent } from "./add-more-sections/add-more-sections.component";
import { NotNeedRegisterSingleStructureComponent } from "./not-need-register-single-structure/not-need-register-single-structure.component";
import { ScopeAndDuplicateHelper } from "src/app/helpers/scope-duplicate-helper";
import { AlreadyRegisteredSingleComponent } from "./duplicates/already-registered-single/already-registered-single.component";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { AlreadyRegisteredMultiComponent } from "./duplicates/already-registered-multi/already-registered-multi.component";
import { WhyContinueRegisterComponent } from "./duplicates/why-continue-register/why-continue-register.component";

@Injectable()
export class BuildingSummaryNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private checkAnswersNavigationNode = new CheckAnswersNavigationNode();
  private addAnotherSectionNavigationTree = new AddAnotherSectionNavigationTree(this.applicationService, this.checkAnswersNavigationNode);
  private sectionsIntroNavigationNode = new SectionsIntroNavigationNode(this.applicationService, this.addAnotherSectionNavigationTree);
  private numberOfSectionsNavigationNode = new NumberOfSectionsNavigationNode(this.applicationService, this.sectionsIntroNavigationNode, this.addAnotherSectionNavigationTree);

  override getNextRoute(): string {
    if (this.applicationService.model.Sections == null || this.applicationService.model.Sections.length == 0) {
      return NumberOfSectionsComponment.route;
    }

    for (let sectionIndex = 0; sectionIndex < this.applicationService.model.Sections.length; sectionIndex++) {
      let section = this.applicationService.model.Sections[sectionIndex];
      let sectionRoute = this.numberOfSectionsNavigationNode.getNextRoute(section, sectionIndex);

      if (sectionRoute === void 0 || sectionRoute == SectionCheckAnswersComponent.route) {
        continue;
      }

      if (sectionRoute == AddMoreSectionsComponent.route) {
        return `sections/${AddMoreSectionsComponent.route}`;
      }

      return `sections/section-${sectionIndex + 1}/${sectionRoute}`;
    }

    return `sections/${SectionCheckAnswersComponent.route}`;
  }
}

class NumberOfSectionsNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
    private sectionsIntroNavigationNode: SectionsIntroNavigationNode,
    private addAnotherSectionNavigationTree: AddAnotherSectionNavigationTree) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!this.applicationService.model.NumberOfSections) {
      return NumberOfSectionsComponment.route;
    }

    if (this.applicationService.model.NumberOfSections == 'two_or_more') {
      return this.addAnotherSectionNavigationTree.getNextRoute(section, sectionIndex);
    }

    return this.sectionsIntroNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class SectionsIntroNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
    private addAnotherSectionNavigationTree: AddAnotherSectionNavigationTree) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.Name && this.applicationService.model.NumberOfSections == 'two_or_mode') {
      return SectionsIntroComponent.route;
    }

    return this.addAnotherSectionNavigationTree.getNextRoute(section, sectionIndex);
  }
}

class SectionNameNavigationNode extends BuildingNavigationNode {
  constructor(private numberOfFloorsNavigationNode: NumberOfFloorsNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.Name) {
      return SectionNameComponent.route;
    }

    return this.numberOfFloorsNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class NumberOfFloorsNavigationNode extends BuildingNavigationNode {
  constructor(private heightNavigationNode: HeightNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.FloorsAbove) {
      return SectionFloorsAboveComponent.route;
    }

    return this.heightNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class HeightNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService, private numberOfResidentialUnitsNavigationNode: NumberOfResidentialUnitsNavigationNode,
     private notNeedRegisterSingleStructureNavigationNode: NotNeedRegisterSingleStructureNavigationNode,
     private notNeedRegisterMultiStructureNavigationNode: NotNeedRegisterMultiStructureNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.Height) {
      return SectionHeightComponent.route;
    } else if (section.Height < 18 && section.FloorsAbove! < 7) {
      return this.applicationService.model.NumberOfSections == 'one' 
        ? this.notNeedRegisterSingleStructureNavigationNode.getNextRoute(section, sectionIndex)
        : this.notNeedRegisterMultiStructureNavigationNode.getNextRoute(section, sectionIndex);
    }
    return this.numberOfResidentialUnitsNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class NumberOfResidentialUnitsNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService, private peopleLivingNavigationNode: PeopleLivingNavigationNode, 
     private notNeedRegisterSingleStructureNavigationNode: NotNeedRegisterSingleStructureNavigationNode,
     private notNeedRegisterMultiStructureNavigationNode: NotNeedRegisterMultiStructureNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.ResidentialUnits) {
      return SectionResidentialUnitsComponent.route;
    } else if (section.ResidentialUnits < 2) {
      return this.applicationService.model.NumberOfSections == 'one'
        ? this.notNeedRegisterSingleStructureNavigationNode.getNextRoute(section, sectionIndex)
        : this.notNeedRegisterMultiStructureNavigationNode.getNextRoute(section, sectionIndex); 
    }

    return this.peopleLivingNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class PeopleLivingNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService, private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode, 
     private notNeedRegisterSingleStructureNavigationNode: NotNeedRegisterSingleStructureNavigationNode,
     private notNeedRegisterMultiStructureNavigationNode: NotNeedRegisterMultiStructureNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.PeopleLivingInBuilding) {
      return SectionPeopleLivingInBuildingComponent.route;
    } else if (section.PeopleLivingInBuilding == 'no_wont_move') {
      return this.applicationService.model.NumberOfSections == 'one'
        ? this.notNeedRegisterSingleStructureNavigationNode.getNextRoute(section, sectionIndex)
        : this.notNeedRegisterMultiStructureNavigationNode.getNextRoute(section, sectionIndex);
    }
    return this.yearOfCompletionNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class NotNeedRegisterSingleStructureNavigationNode extends BuildingNavigationNode {
  constructor() {
    super();
  }

  override getNextRoute(_: SectionModel, __: number): string {
    return NotNeedRegisterSingleStructureComponent.route;
  }
}

class NotNeedRegisterMultiStructureNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService, private addAnotherSectionNavigationNode: AddAnotherSectionNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    return this.addAnotherSectionNavigationNode.getNextRoute(section, sectionIndex);
  }
}


class YearOfCompletionNavigationNode extends BuildingNavigationNode {
  constructor(private yearRangeNavigationNode: YearRangeNavigationNode,
    private completionCertificateIssuerNavigationNode: CompletionCertificateIssuerNavigationNode,
    private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.YearOfCompletionOption) {
      return SectionYearOfCompletionComponent.route;
    }

    if (section.YearOfCompletionOption == 'not-completed') {
      return this.sectionAddressNavigationNode.getNextRoute(section, sectionIndex);
    } else if (section.YearOfCompletionOption == 'year-exact') {
      var yearOfCompletion = Number(section.YearOfCompletion);
      if (yearOfCompletion && yearOfCompletion < 1985) {
        return this.sectionAddressNavigationNode.getNextRoute(section, sectionIndex);
      }
    }

    if (section.YearOfCompletionOption == 'year-not-exact') {
      return this.yearRangeNavigationNode.getNextRoute(section, sectionIndex);
    }

    return this.completionCertificateIssuerNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class YearRangeNavigationNode extends BuildingNavigationNode {
  constructor(private completionCertificateIssuerNavigationNode: CompletionCertificateIssuerNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.YearOfCompletionRange) {
      return SectionYearRangeComponent.route;
    }

    return this.completionCertificateIssuerNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class CompletionCertificateIssuerNavigationNode extends BuildingNavigationNode {
  constructor(private completionCertificateReferenceNavigationNode: CompletionCertificateReferenceNavigationNode,
    private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!this.shouldDisplay(section)) {
      return this.sectionAddressNavigationNode.getNextRoute(section, sectionIndex);
    }

    if (!section.CompletionCertificateIssuer) {
      return CertificateIssuerComponent.route;
    }

    return this.completionCertificateReferenceNavigationNode.getNextRoute(section, sectionIndex);
  }

  private shouldDisplay(section: SectionModel): boolean {
    if (section.YearOfCompletionOption == 'not-completed') {
      return false;
    }

    if (section.YearOfCompletionOption == 'year-exact') {
      var yearOfCompletion = Number(section.YearOfCompletion);
      if (yearOfCompletion && yearOfCompletion < 1985) {
        return false;
      }
    }

    if (["Before-1900", "1901-to-1955", "1956-to-1969", "1970-to-1984"].indexOf(section.YearOfCompletionRange!) > -1) {
      return false;
    }

    if (section.Addresses?.length > 0) {
      return false;
    }

    return true;
  }
}

class CompletionCertificateReferenceNavigationNode extends BuildingNavigationNode {
  constructor(private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.CompletionCertificateReference) {
      return CertificateNumberComponent.route;
    }

    return this.sectionAddressNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class SectionAddressNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
      private addAnotherSectionNavigationNode: AddAnotherSectionNavigationNode,
      private alreadyRegisteredMultiNavigationNode: AlreadyRegisteredMultiNavigationNode,
      private alreadyRegisteredSingleNavigationNode: AlreadyRegisteredSingleNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if ((section.Addresses?.length ?? 0) == 0 || section.Addresses.filter(x => !x.Postcode).length > 0) {
      return SectionAddressComponent.route;
    }

    if (!!section.Duplicate?.RegisteredStructureModel) {
      return this.applicationService.model.NumberOfSections == 'one' 
        ? this.alreadyRegisteredSingleNavigationNode.getNextRoute(section, sectionIndex)
        : this.alreadyRegisteredMultiNavigationNode.getNextRoute(section, sectionIndex); 
    }
    
    return this.addAnotherSectionNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class AlreadyRegisteredMultiNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
      private addAnotherSectionNavigationNode: AddAnotherSectionNavigationNode,
      private keepStructureDeclarationNavigationNode: KeepStructureDeclarationNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!FieldValidations.IsNotNullOrWhitespace(section.Duplicate?.IncludeStructure)) {
      return AlreadyRegisteredMultiComponent.route;
    }

    if (section.Duplicate?.IncludeStructure == 'yes') {
      return this.keepStructureDeclarationNavigationNode.getNextRoute(section, sectionIndex);
    }

    return this.addAnotherSectionNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class AlreadyRegisteredSingleNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
      private addAnotherSectionNavigationNode: AddAnotherSectionNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if(section.Duplicate?.IsDuplicated == undefined) {
      return AlreadyRegisteredSingleComponent.route;
    }

    return this.addAnotherSectionNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class KeepStructureDeclarationNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
      private whyContinueRegisterNavigationNode: WhyContinueRegisterNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if(section.Duplicate?.IsDuplicated == undefined) {
      return AlreadyRegisteredSingleComponent.route;
    }

    return this.whyContinueRegisterNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class WhyContinueRegisterNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
      private addAnotherSectionNavigationNode: AddAnotherSectionNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!FieldValidations.IsNotNullOrWhitespace(section.Duplicate?.WhyContinue)) {
      return WhyContinueRegisterComponent.route;
    }

    return this.addAnotherSectionNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class NotNeedRegisterMultiDuplicatedStructuresNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    return "";
  }
}

class AddAnotherSectionNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
    private CheckAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (sectionIndex == this.applicationService.model.Sections.length - 1 && this.applicationService.model.NumberOfSections == 'two_or_more') {
      return AddMoreSectionsComponent.route;
    } else if (ScopeAndDuplicateHelper.AreAllSectionsOutOfScope(this.applicationService)) {
      // goes to 6802 all structures are out of scope.
    }
    // check if the all the structures are in scope or not.
    return this.CheckAnswersNavigationNode.getNextRoute(section, sectionIndex);
  }

}

class AddAnotherSectionNavigationTree extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
    private checkAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  private addAnotherSectionNavigationNode = new AddAnotherSectionNavigationNode(this.applicationService, this.checkAnswersNavigationNode);
  private notNeedRegisterMultiStructureNavigationNode = new NotNeedRegisterMultiStructureNavigationNode(this.applicationService, this.addAnotherSectionNavigationNode);
  private notNeedRegisterSingleStructureNavigationNode = new NotNeedRegisterSingleStructureNavigationNode();
  
  private notNeedRegisterMultiDuplicatedStructuresNavigationNode = new NotNeedRegisterMultiDuplicatedStructuresNavigationNode(this.applicationService);
  private whyContinueRegisterNavigationNode = new WhyContinueRegisterNavigationNode(this.applicationService, this.addAnotherSectionNavigationNode);
  private keepStructureDeclarationNavigationNode = new KeepStructureDeclarationNavigationNode(this.applicationService, this.whyContinueRegisterNavigationNode);
  private alreadyRegisteredSingleNavigationNode = new AlreadyRegisteredSingleNavigationNode(this.applicationService, this.addAnotherSectionNavigationNode);
  private alreadyRegisteredMultiNavigationNode = new AlreadyRegisteredMultiNavigationNode(this.applicationService, this.addAnotherSectionNavigationNode, this.keepStructureDeclarationNavigationNode);
  
  private sectionAddressNavigationNode = new SectionAddressNavigationNode(this.applicationService, this.addAnotherSectionNavigationNode, this.alreadyRegisteredMultiNavigationNode, this.alreadyRegisteredSingleNavigationNode);
  private completionCertificateReferenceNavigationNode = new CompletionCertificateReferenceNavigationNode(this.sectionAddressNavigationNode);
  private completionCertificateIssuerNavigationNode = new CompletionCertificateIssuerNavigationNode(this.completionCertificateReferenceNavigationNode, this.sectionAddressNavigationNode);
  private yearRangeNavigationNode = new YearRangeNavigationNode(this.completionCertificateIssuerNavigationNode);
  private yearOfCompletionNavigationNode = new YearOfCompletionNavigationNode(this.yearRangeNavigationNode, this.completionCertificateIssuerNavigationNode, this.sectionAddressNavigationNode);
  private peopleLivingNavigationNode = new PeopleLivingNavigationNode(this.applicationService, this.yearOfCompletionNavigationNode, this.notNeedRegisterSingleStructureNavigationNode, this.notNeedRegisterMultiStructureNavigationNode);
  private numberOfResidentialUnitsNavigationNode = new NumberOfResidentialUnitsNavigationNode(this.applicationService, this.peopleLivingNavigationNode, this.notNeedRegisterSingleStructureNavigationNode, this.notNeedRegisterMultiStructureNavigationNode);
  private heightNavigationNode = new HeightNavigationNode(this.applicationService, this.numberOfResidentialUnitsNavigationNode, this.notNeedRegisterSingleStructureNavigationNode, this.notNeedRegisterMultiStructureNavigationNode);
  private numberOfFloorsNavigationNode = new NumberOfFloorsNavigationNode(this.heightNavigationNode);
  private sectionNameNavigationNode = new SectionNameNavigationNode(this.numberOfFloorsNavigationNode);

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (this.applicationService.model.NumberOfSections == 'two_or_more') {
      return this.sectionNameNavigationNode.getNextRoute(section, sectionIndex);
    }

    return this.numberOfFloorsNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class CheckAnswersNavigationNode extends BuildingNavigationNode {
  override getNextRoute(_: SectionModel, __: number): string {
    return SectionCheckAnswersComponent.route;
  }
}