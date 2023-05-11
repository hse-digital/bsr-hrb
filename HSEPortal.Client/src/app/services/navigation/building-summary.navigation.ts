import { NumberOfSectionsComponment } from "src/app/features/application/number-of-sections/number-of-sections.component";
import { ApplicationService, SectionModel } from "../application.service";
import { BaseNavigation, BuildingNavigationNode } from "./navigation";
import { SectionsIntroComponent } from "src/app/features/application/sections/intro/intro.component";
import { SectionNameComponent } from "src/app/features/application/sections/name/name.component";
import { SectionFloorsAboveComponent } from "src/app/features/application/sections/floors-above/floors-above.component";
import { SectionHeightComponent } from "src/app/features/application/sections/height/height.component";
import { SectionResidentialUnitsComponent } from "src/app/features/application/sections/residential-units/residential-units.component";
import { SectionPeopleLivingInBuildingComponent } from "src/app/features/application/sections/people-living-in-building/people-living-in-building.component";
import { SectionYearOfCompletionComponent } from "src/app/features/application/sections/year-of-completion/year-of-completion.component";
import { SectionYearRangeComponent } from "src/app/features/application/sections/year-range/year-range.component";
import { CertificateIssuerComponent } from "src/app/features/application/sections/certificate-issuer/certificate-issuer.component";
import { CertificateNumberComponent } from "src/app/features/application/sections/certificate-number/certificate-number.component";
import { SectionAddressComponent } from "src/app/features/application/sections/address/address.component";
import { SectionCheckAnswersComponent } from "src/app/features/application/sections/check-answers/check-answers.component";
import { Injectable } from "@angular/core";
import { AddMoreSectionsComponent } from "src/app/features/application/sections/add-more-sections/add-more-sections.component";

@Injectable({ providedIn: 'root' })
export class BuildingSummaryNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private checkAnswersNavigationNode = new CheckAnswersNavigationNode();
  private addAnotherSectionNavigationTree = new AddAnotherSectionNavigationTree(this.applicationService, this.checkAnswersNavigationNode);
  private sectionsIntroNavigationNode = new SectionsIntroNavigationNode(this.addAnotherSectionNavigationTree);
  private numberOfSectionsNavigationNode = new NumberOfSectionsNavigationNode(this.applicationService, this.sectionsIntroNavigationNode, this.addAnotherSectionNavigationTree);

  override getNextRoute(): string {
    if (!this.applicationService.model.Sections) {
      return NumberOfSectionsComponment.route;
    }

    for (let sectionIndex = 0; sectionIndex < this.applicationService.model.Sections.length; sectionIndex++) {
      let section = this.applicationService.model.Sections[sectionIndex];
      let sectionRoute = this.numberOfSectionsNavigationNode.getNextRoute(section, sectionIndex);

      console.log(sectionRoute);

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

    if (this.applicationService.model.NumberOfSections == 'one') {
      return this.addAnotherSectionNavigationTree.getNextRoute(section, sectionIndex);
    }

    return this.sectionsIntroNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class SectionsIntroNavigationNode extends BuildingNavigationNode {
  constructor(private addAnotherSectionNavigationTree: AddAnotherSectionNavigationTree) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.Name) {
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
  constructor(private numberOfResidentialUnitsNavigationNode: NumberOfResidentialUnitsNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.Height) {
      return SectionHeightComponent.route;
    }

    return this.numberOfResidentialUnitsNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class NumberOfResidentialUnitsNavigationNode extends BuildingNavigationNode {
  constructor(private peopleLivingNavigationNode: PeopleLivingNavigationNode,
    private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.ResidentialUnits) {
      return SectionResidentialUnitsComponent.route;
    }

    if (section.ResidentialUnits == 0) {
      return this.yearOfCompletionNavigationNode.getNextRoute(section, sectionIndex);
    }

    return this.peopleLivingNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class PeopleLivingNavigationNode extends BuildingNavigationNode {
  constructor(private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (!section.PeopleLivingInBuilding) {
      return SectionPeopleLivingInBuildingComponent.route;
    }

    return this.yearOfCompletionNavigationNode.getNextRoute(section, sectionIndex);
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
  constructor(private addAnotherSectionNavigationNode: AddAnotherSectionNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if ((section.Addresses?.length ?? 0) == 0 || section.Addresses.filter(x => !x.Postcode).length > 0) {
      return SectionAddressComponent.route;
    }

    return this.addAnotherSectionNavigationNode.getNextRoute(section, sectionIndex);
  }
}

class AddAnotherSectionNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
    private CheckAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel, sectionIndex: number): string {
    if (sectionIndex == this.applicationService.model.Sections.length - 1) {
      return AddMoreSectionsComponent.route;
    }

    return this.CheckAnswersNavigationNode.getNextRoute(section, sectionIndex);
  }

}

class AddAnotherSectionNavigationTree extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
    private checkAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  private addAnotherSectionNavigationNode = new AddAnotherSectionNavigationNode(this.applicationService, this.checkAnswersNavigationNode);
  private sectionAddressNavigationNode = new SectionAddressNavigationNode(this.addAnotherSectionNavigationNode);
  private completionCertificateReferenceNavigationNode = new CompletionCertificateReferenceNavigationNode(this.sectionAddressNavigationNode);
  private completionCertificateIssuerNavigationNode = new CompletionCertificateIssuerNavigationNode(this.completionCertificateReferenceNavigationNode, this.sectionAddressNavigationNode);
  private yearRangeNavigationNode = new YearRangeNavigationNode(this.completionCertificateIssuerNavigationNode);
  private yearOfCompletionNavigationNode = new YearOfCompletionNavigationNode(this.yearRangeNavigationNode, this.completionCertificateIssuerNavigationNode, this.sectionAddressNavigationNode);
  private peopleLivingNavigationNode = new PeopleLivingNavigationNode(this.yearOfCompletionNavigationNode);
  private numberOfResidentialUnitsNavigationNode = new NumberOfResidentialUnitsNavigationNode(this.peopleLivingNavigationNode, this.yearOfCompletionNavigationNode);
  private heightNavigationNode = new HeightNavigationNode(this.numberOfResidentialUnitsNavigationNode);
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