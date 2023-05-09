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

@Injectable({ providedIn: 'root' })
export class BuildingSummaryNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private checkAnswersNavigationNode = new CheckAnswersNavigationNode();
  private sectionAddressNavigationNode = new SectionAddressNavigationNode(this.checkAnswersNavigationNode);
  private completionCertificateReferenceNavigationNode = new CompletionCertificateReferenceNavigationNode(this.sectionAddressNavigationNode);
  private completionCertificateIssuerNavigationNode = new CompletionCertificateIssuerNavigationNode(this.completionCertificateReferenceNavigationNode);
  private yearRangeNavigationNode = new YearRangeNavigationNode(this.completionCertificateIssuerNavigationNode);
  private yearOfCompletionNavigationNode = new YearOfCompletionNavigationNode(this.yearRangeNavigationNode, this.completionCertificateIssuerNavigationNode, this.sectionAddressNavigationNode);
  private peopleLivingNavigationNode = new PeopleLivingNavigationNode(this.yearOfCompletionNavigationNode);
  private numberOfResidentialUnitsNavigationNode = new NumberOfResidentialUnitsNavigationNode(this.peopleLivingNavigationNode, this.yearOfCompletionNavigationNode);
  private heightNavigationNode = new HeightNavigationNode(this.numberOfResidentialUnitsNavigationNode);
  private numberOfFloorsNavigationNode = new NumberOfFloorsNavigationNode(this.heightNavigationNode);
  private sectionNameNavigationNode = new SectionNameNavigationNode(this.numberOfFloorsNavigationNode);
  private sectionsIntroNavigationNode = new SectionsIntroNavigationNode(this.sectionNameNavigationNode);
  private numberOfSectionsNavigationNode = new NumberOfSectionsNavigationNode(this.applicationService, this.sectionsIntroNavigationNode, this.numberOfFloorsNavigationNode);

  override getNextRoute(): string {
    for (let sectionIndex = 0; sectionIndex < this.applicationService.model.Sections.length; sectionIndex++) {
      let section = this.applicationService.model.Sections[sectionIndex];
      let sectionRoute = this.numberOfSectionsNavigationNode.getNextRoute(section);

      if (!sectionRoute || sectionRoute == SectionCheckAnswersComponent.route) {
        continue;
      }

      return `sections/section-${sectionIndex + 1}/${sectionRoute}`;
    }

    return `sections/${SectionCheckAnswersComponent.route}`;
  }
}

class NumberOfSectionsNavigationNode extends BuildingNavigationNode {
  constructor(private applicationService: ApplicationService,
    private sectionsIntroNavigationNode: SectionsIntroNavigationNode,
    private numberOfFloorsNavigationNode: NumberOfFloorsNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!this.applicationService.model.NumberOfSections) {
      return NumberOfSectionsComponment.route;
    }

    if (this.applicationService.model.NumberOfSections == 'one') {
      return this.numberOfFloorsNavigationNode.getNextRoute(section);
    }

    return this.sectionsIntroNavigationNode.getNextRoute(section);
  }
}

class SectionsIntroNavigationNode extends BuildingNavigationNode {
  constructor(private sectionNameNavigationNode: SectionNameNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.Name) {
      return SectionsIntroComponent.route;
    }

    return this.sectionNameNavigationNode.getNextRoute(section);
  }
}

class SectionNameNavigationNode extends BuildingNavigationNode {
  constructor(private numberOfFloorsNavigationNode: NumberOfFloorsNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.Name) {
      return SectionNameComponent.route;
    }

    return this.numberOfFloorsNavigationNode.getNextRoute(section);
  }
}

class NumberOfFloorsNavigationNode extends BuildingNavigationNode {
  constructor(private heightNavigationNode: HeightNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.FloorsAbove) {
      return SectionFloorsAboveComponent.route;
    }

    return this.heightNavigationNode.getNextRoute(section);
  }
}

class HeightNavigationNode extends BuildingNavigationNode {
  constructor(private numberOfResidentialUnitsNavigationNode: NumberOfResidentialUnitsNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.Height) {
      return SectionHeightComponent.route;
    }

    return this.numberOfResidentialUnitsNavigationNode.getNextRoute(section);
  }
}

class NumberOfResidentialUnitsNavigationNode extends BuildingNavigationNode {
  constructor(private peopleLivingNavigationNode: PeopleLivingNavigationNode,
    private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.ResidentialUnits) {
      return SectionResidentialUnitsComponent.route;
    }

    if (section.ResidentialUnits == 0) {
      return this.yearOfCompletionNavigationNode.getNextRoute(section);
    }

    return this.peopleLivingNavigationNode.getNextRoute(section);
  }
}

class PeopleLivingNavigationNode extends BuildingNavigationNode {
  constructor(private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.PeopleLivingInBuilding) {
      return SectionPeopleLivingInBuildingComponent.route;
    }

    return this.yearOfCompletionNavigationNode.getNextRoute(section);
  }
}

class YearOfCompletionNavigationNode extends BuildingNavigationNode {
  constructor(private yearRangeNavigationNode: YearRangeNavigationNode,
    private completionCertificateIssuerNavigationNode: CompletionCertificateIssuerNavigationNode,
    private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.YearOfCompletionOption) {
      return SectionYearOfCompletionComponent.route;
    }

    if (section.YearOfCompletionOption == 'not-completed') {
      return this.sectionAddressNavigationNode.getNextRoute(section);
    } else if (section.YearOfCompletionOption == 'year-exact') {
      var yearOfCompletion = Number(section.YearOfCompletion);
      if (yearOfCompletion && yearOfCompletion < 1985) {
        return this.sectionAddressNavigationNode.getNextRoute(section);
      }
    }

    if (section.YearOfCompletionOption == 'year-not-exact') {
      return this.yearRangeNavigationNode.getNextRoute(section);
    }

    return this.completionCertificateIssuerNavigationNode.getNextRoute(section);
  }
}

class YearRangeNavigationNode extends BuildingNavigationNode {
  constructor(private completionCertificateIssuerNavigationNode: CompletionCertificateIssuerNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.YearOfCompletionRange) {
      return SectionYearRangeComponent.route;
    }

    return this.completionCertificateIssuerNavigationNode.getNextRoute(section);
  }
}

class CompletionCertificateIssuerNavigationNode extends BuildingNavigationNode {
  constructor(private completionCertificateReferenceNavigationNode: CompletionCertificateReferenceNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.CompletionCertificateIssuer) {
      return CertificateIssuerComponent.route;
    }

    return this.completionCertificateReferenceNavigationNode.getNextRoute(section);
  }
}

class CompletionCertificateReferenceNavigationNode extends BuildingNavigationNode {
  constructor(private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if (!section.CompletionCertificateReference) {
      return CertificateNumberComponent.route;
    }

    return this.sectionAddressNavigationNode.getNextRoute(section);
  }
}

class SectionAddressNavigationNode extends BuildingNavigationNode {
  constructor(private checkAnswersNavigationNode: CheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(section: SectionModel): string {
    if ((section.Addresses?.length ?? 0) == 0 || section.Addresses.filter(x => !x.Postcode).length > 0) {
      return SectionAddressComponent.route;
    }

    return this.checkAnswersNavigationNode.getNextRoute(section);
  }
}

class CheckAnswersNavigationNode extends BuildingNavigationNode {
  override getNextRoute(_: SectionModel): string {
    return SectionCheckAnswersComponent.route;
  }
}