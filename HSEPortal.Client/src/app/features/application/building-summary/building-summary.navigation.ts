import { NumberOfSectionsComponment } from "./number-of-sections/number-of-sections.component";
import { ApplicationService, SectionModel } from "../../../services/application.service";
import { BaseNavigation, BuildingNavigationNode } from "../../../services/navigation";
import { SectionsIntroComponent } from "./intro/intro.component";
import { SectionNameComponent } from "./name/name.component";
import { SectionFloorsAboveComponent } from "./floors-above/floors-above.component";
import { SectionHeightComponent } from "./height/height.component";
import { SectionResidentialUnitsComponent } from "./residential-units/residential-units.component";
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
import { KeepStructureDeclarationComponent } from "./duplicates/keep-structure-declaration/keep-structure-declaration.component";
import { WhoIssuedCertificateComponent } from "./who-issued-certificate/who-issued-certificate.component";
import { CompletionCertificateDateComponent } from "./completion-certificate-date/completion-certificate-date.component";
import { UploadCompletionCertificateComponent } from "./upload-completion-certificate/upload-completion-certificate.component";
import { BuildingChangeCheckAnswersComponent } from "../../registration-amendments/change-building-summary/building-change-check-answers/building-change-check-answers.component";

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

  getNextChangeRoute(section: SectionModel) {
    let sectionRoute = this.numberOfSectionsNavigationNode.getNextRoute(section, 0);
    if (sectionRoute === void 0 || sectionRoute == SectionCheckAnswersComponent.route || sectionRoute == AddMoreSectionsComponent.route) {
      return BuildingChangeCheckAnswersComponent.route;
    }
    return sectionRoute;
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
  constructor(private applicationService: ApplicationService,  private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode, 
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

    return this.yearOfCompletionNavigationNode.getNextRoute(section, sectionIndex);
  }
}

// class PeopleLivingNavigationNode extends BuildingNavigationNode {
//   constructor(private applicationService: ApplicationService, private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode, 
//      private notNeedRegisterSingleStructureNavigationNode: NotNeedRegisterSingleStructureNavigationNode,
//      private notNeedRegisterMultiStructureNavigationNode: NotNeedRegisterMultiStructureNavigationNode) {
//     super();
//   }

//   override getNextRoute(section: SectionModel, sectionIndex: number): string {
//     if (!section.PeopleLivingInBuilding) {
//       return SectionPeopleLivingInBuildingComponent.route;
//     } else if (section.PeopleLivingInBuilding == 'no_wont_move') {
//       return this.applicationService.model.NumberOfSections == 'one'
//         ? this.notNeedRegisterSingleStructureNavigationNode.getNextRoute(section, sectionIndex)
//         : this.notNeedRegisterMultiStructureNavigationNode.getNextRoute(section, sectionIndex);
//     }
//     return this.yearOfCompletionNavigationNode.getNextRoute(section, sectionIndex);
//   }
// }

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
    private whoIssuedCertificateNavigationNode: WhoIssuedCertificateNavigationNode,
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
      if (yearOfCompletion && yearOfCompletion < 2023) {
        return this.completionCertificateIssuerNavigationNode.getNextRoute(section, sectionIndex);
      }
    }

    if (section.YearOfCompletionOption == 'year-not-exact') {
      return this.yearRangeNavigationNode.getNextRoute(section, sectionIndex);
    }

    return this.whoIssuedCertificateNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class YearRangeNavigationNode extends BuildingNavigationNode {
  constructor(private whoIssuedCertificateNavigationNode: WhoIssuedCertificateNavigationNode, private completionCertificateIssuerNavigationNode: CompletionCertificateIssuerNavigationNode,
    private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {

    if (!section.YearOfCompletionRange) {
      return SectionYearRangeComponent.route;
    } else if (section.YearOfCompletionRange == "2023-onwards") {
      return this.whoIssuedCertificateNavigationNode.getNextRoute(section, sectionIndex);
    } else if (section.YearOfCompletionRange == "not-completed") {
      return this.sectionAddressNavigationNode.getNextRoute(section, sectionIndex);
    }

    
    return this.completionCertificateIssuerNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class WhoIssuedCertificateNavigationNode extends BuildingNavigationNode {
  constructor(private completionCertificateIssuerNavigationNode: CompletionCertificateIssuerNavigationNode, private completionCertificateDateNavigationNode: CompletionCertificateDateNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if(!FieldValidations.IsNotNullOrWhitespace(section.WhoIssuedCertificate)) return WhoIssuedCertificateComponent.route;

    if(section.WhoIssuedCertificate == "bsr") {
      return this.completionCertificateDateNavigationNode.getNextRoute(section, sectionIndex);
    }
    return this.completionCertificateIssuerNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class CompletionCertificateDateNavigationNode extends BuildingNavigationNode {
  constructor(private completionCertificateReferenceNavigationNode: CompletionCertificateReferenceNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    let isMandatory = (section.YearOfCompletionOption == 'year-exact' && Number(section.YearOfCompletion) >= 2023) || 
    (section.YearOfCompletionOption == "year-not-exact" && section.YearOfCompletionRange == "2023-onwards");

    if (!FieldValidations.IsNotNullOrWhitespace(section.CompletionCertificateDate) && isMandatory) {
      return CompletionCertificateDateComponent.route;
    }
    return this.completionCertificateReferenceNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class CompletionCertificateIssuerNavigationNode extends BuildingNavigationNode {
  constructor(private completionCertificateDateNavigationNode: CompletionCertificateDateNavigationNode,
    private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    let isMandatory = (section.YearOfCompletionOption == 'year-exact' && Number(section.YearOfCompletion) >= 2023) || 
      (section.YearOfCompletionOption == "year-not-exact" && section.YearOfCompletionRange == "2023-onwards");

    if (!section.CompletionCertificateIssuer && isMandatory) {
      return CertificateIssuerComponent.route;
    }

    return this.completionCertificateDateNavigationNode.getNextRoute(section, sectionIndex);
  }

}

class CompletionCertificateFileNavigationNode extends BuildingNavigationNode {
  constructor(private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {    
    let isOptional = this.isPageOptional(section.CompletionCertificateDate);
    if ((!section.CompletionCertificateFile || !section.CompletionCertificateFile.Uploaded) && !isOptional) {
      return UploadCompletionCertificateComponent.route;
    }
    return this.sectionAddressNavigationNode.getNextRoute(section, sectionIndex);
  }

  isPageOptional(completionCertificateDate?: string) {
    if(FieldValidations.IsNotNullOrWhitespace(completionCertificateDate)) {
      let date =  new Date(Number(completionCertificateDate));
      let FirstOctober2023 = new Date(2023, 9, 1); // Month is October, but index is 9 -> "The month as a number between 0 and 11 (January to December)."
      return date < FirstOctober2023;
    }
    return true;
  }
}

class CompletionCertificateReferenceNavigationNode extends BuildingNavigationNode {
  constructor(private completionCertificateFileNavigationNode: CompletionCertificateFileNavigationNode, private sectionAddressNavigationNode: SectionAddressNavigationNode ) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    let isOptional = this.isPageOptional(section.CompletionCertificateDate);

    if (!section.CompletionCertificateReference && !isOptional) {      
      return CertificateNumberComponent.route;
    } else if (section.WhoIssuedCertificate == "bsr") {
      return this.sectionAddressNavigationNode.getNextRoute(section, sectionIndex);
    }

    return this.completionCertificateFileNavigationNode.getNextRoute(section, sectionIndex);
  }

  isPageOptional(completionCertificateDate?: string) {
    if(FieldValidations.IsNotNullOrWhitespace(completionCertificateDate)) {
      let date =  new Date(Number(completionCertificateDate));
      let FirstOctober2023 = new Date(2023, 9, 1); // Month is October, but index is 9 -> "The month as a number between 0 and 11 (January to December)."
      return date < FirstOctober2023;
    }
    return true;
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

    if (!!section.Duplicate?.RegisteredStructureModel || section.Duplicate?.DuplicateFound) {
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

class KeepStructureDeclarationNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
      private whyContinueRegisterNavigationNode: WhyContinueRegisterNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if(section.Duplicate?.IsDuplicated == undefined) {
      return KeepStructureDeclarationComponent.route;
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
  private alreadyRegisteredSingleNavigationNode = new AlreadyRegisteredSingleNavigationNode(this.applicationService, this.whyContinueRegisterNavigationNode);
  private alreadyRegisteredMultiNavigationNode = new AlreadyRegisteredMultiNavigationNode(this.applicationService, this.addAnotherSectionNavigationNode, this.keepStructureDeclarationNavigationNode);
  
  private sectionAddressNavigationNode = new SectionAddressNavigationNode(this.applicationService, this.addAnotherSectionNavigationNode, this.alreadyRegisteredMultiNavigationNode, this.alreadyRegisteredSingleNavigationNode);
  private completionCertificateFilerNavigationNode = new CompletionCertificateFileNavigationNode(this.sectionAddressNavigationNode);  
  private completionCertificateReferenceNavigationNode = new CompletionCertificateReferenceNavigationNode(this.completionCertificateFilerNavigationNode, this.sectionAddressNavigationNode);
  private completionCertificateDateNavigationNode = new CompletionCertificateDateNavigationNode(this.completionCertificateReferenceNavigationNode);
  private completionCertificateIssuerNavigationNode = new CompletionCertificateIssuerNavigationNode(this.completionCertificateDateNavigationNode, this.sectionAddressNavigationNode);
  private whoIssuedCertificateNavigationNode = new WhoIssuedCertificateNavigationNode(this.completionCertificateIssuerNavigationNode, this.completionCertificateDateNavigationNode);
  private yearRangeNavigationNode = new YearRangeNavigationNode(this.whoIssuedCertificateNavigationNode, this.completionCertificateIssuerNavigationNode, this.sectionAddressNavigationNode);
  private yearOfCompletionNavigationNode = new YearOfCompletionNavigationNode(this.yearRangeNavigationNode, this.whoIssuedCertificateNavigationNode, this.completionCertificateIssuerNavigationNode, this.sectionAddressNavigationNode);
  //private peopleLivingNavigationNode = new PeopleLivingNavigationNode(this.applicationService, this.yearOfCompletionNavigationNode, this.notNeedRegisterSingleStructureNavigationNode, this.notNeedRegisterMultiStructureNavigationNode);
  private numberOfResidentialUnitsNavigationNode = new NumberOfResidentialUnitsNavigationNode(this.applicationService, this.yearOfCompletionNavigationNode, this.notNeedRegisterSingleStructureNavigationNode, this.notNeedRegisterMultiStructureNavigationNode);
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