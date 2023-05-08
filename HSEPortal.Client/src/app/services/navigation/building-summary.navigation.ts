import { NumberOfSectionsComponment } from "src/app/features/application/number-of-sections/number-of-sections.component";
import { ApplicationService } from "../application.service";
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
import { SectionOtherAddressesComponent } from "src/app/features/application/sections/other-addresses/other-addresses.component";
import { AddMoreSectionsComponent } from "src/app/features/application/sections/add-more-sections/add-more-sections.component";
import { SectionCheckAnswersComponent } from "src/app/features/application/sections/check-answers/check-answers.component";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class BuildingSummaryNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private checkAnswersNavigationNode = new CheckAnswersNavigationNode(this.applicationService);
  private addMoreSectionsNavigationNode = new AddMoreSectionsNavigationNode(this.applicationService, this.checkAnswersNavigationNode);
  private sectionMoreAddressesNavigationNode = new SectionMoreAddressesNavigationNode(this.applicationService, this.addMoreSectionsNavigationNode);
  private sectionAddressNavigationNode = new SectionAddressNavigationNode(this.applicationService, this.sectionMoreAddressesNavigationNode);
  private completionCertificateReferenceNavigationNode = new CompletionCertificateReferenceNavigationNode(this.applicationService, this.sectionAddressNavigationNode);
  private completionCertificateIssuerNavigationNode = new CompletionCertificateIssuerNavigationNode(this.applicationService, this.completionCertificateReferenceNavigationNode);
  private yearRangeNavigationNode = new YearRangeNavigationNode(this.applicationService, this.completionCertificateIssuerNavigationNode);
  private yearOfCompletionNavigationNode = new YearOfCompletionNavigationNode(this.applicationService, this.yearRangeNavigationNode, this.completionCertificateIssuerNavigationNode, this.sectionAddressNavigationNode);
  private peopleLivingNavigationNode = new PeopleLivingNavigationNode(this.applicationService, this.yearOfCompletionNavigationNode);
  private numberOfResidentialUnitsNavigationNode = new NumberOfResidentialUnitsNavigationNode(this.applicationService, this.peopleLivingNavigationNode, this.yearOfCompletionNavigationNode);
  private heightNavigationNode = new HeightNavigationNode(this.applicationService, this.numberOfResidentialUnitsNavigationNode);
  private numberOfFloorsNavigationNode = new NumberOfFloorsNavigationNode(this.applicationService, this.heightNavigationNode);
  private sectionNameNavigationNode = new SectionNameNavigationNode(this.applicationService, this.numberOfFloorsNavigationNode);
  private sectionsIntroNavigationNode = new SectionsIntroNavigationNode(this.applicationService, this.sectionNameNavigationNode);
  private numberOfSectionsNavigationNode = new NumberOfSectionsNavigationNode(this.applicationService, this.sectionsIntroNavigationNode, this.numberOfFloorsNavigationNode);

  override getNextRoute(): string {
    return this.numberOfSectionsNavigationNode.getNextRoute();
  }
}

class NumberOfSectionsNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private sectionsIntroNavigationNode: SectionsIntroNavigationNode,
    private numberOfFloorsNavigationNode: NumberOfFloorsNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.model.NumberOfSections) {
      return NumberOfSectionsComponment.route;
    }

    if (this.applicationService.model.NumberOfSections == 'one') {
      return this.numberOfFloorsNavigationNode.getNextRoute();
    }

    return this.sectionsIntroNavigationNode.getNextRoute();
  }
}

class SectionsIntroNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private sectionNameNavigationNode: SectionNameNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.Name) {
      return SectionsIntroComponent.route;
    }

    return this.sectionNameNavigationNode.getNextRoute();
  }
}

class SectionNameNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private numberOfFloorsNavigationNode: NumberOfFloorsNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.Name) {
      return SectionNameComponent.route;
    }

    return this.numberOfFloorsNavigationNode.getNextRoute();
  }
}

class NumberOfFloorsNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private heightNavigationNode: HeightNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.FloorsAbove) {
      return this.getCurrentSectionRouteTo(SectionFloorsAboveComponent.route);
    }

    return this.heightNavigationNode.getNextRoute();
  }
}

class HeightNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private numberOfResidentialUnitsNavigationNode: NumberOfResidentialUnitsNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.Height) {
      return this.getCurrentSectionRouteTo(SectionHeightComponent.route);
    }

    return this.numberOfResidentialUnitsNavigationNode.getNextRoute();
  }
}

class NumberOfResidentialUnitsNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private peopleLivingNavigationNode: PeopleLivingNavigationNode,
    private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.ResidentialUnits) {
      return this.getCurrentSectionRouteTo(SectionResidentialUnitsComponent.route);
    }

    if (this.applicationService.currentSection.ResidentialUnits == 0) {
      return this.yearOfCompletionNavigationNode.getNextRoute();
    }

    return this.peopleLivingNavigationNode.getNextRoute();
  }
}

class PeopleLivingNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private yearOfCompletionNavigationNode: YearOfCompletionNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.PeopleLivingInBuilding) {
      return this.getCurrentSectionRouteTo(SectionPeopleLivingInBuildingComponent.route);
    }

    return this.yearOfCompletionNavigationNode.getNextRoute();
  }
}

class YearOfCompletionNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private yearRangeNavigationNode: YearRangeNavigationNode,
    private completionCertificateIssuerNavigationNode: CompletionCertificateIssuerNavigationNode,
    private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.YearOfCompletionOption) {
      return this.getCurrentSectionRouteTo(SectionYearOfCompletionComponent.route);
    }

    if (this.applicationService.currentSection.YearOfCompletionOption == 'not-completed') {
      return this.sectionAddressNavigationNode.getNextRoute();
    } else if (this.applicationService.currentSection.YearOfCompletionOption == 'year-exact') {
      var yearOfCompletion = Number(this.applicationService.currentSection.YearOfCompletion);
      if (yearOfCompletion && yearOfCompletion < 1985) {
        return this.sectionAddressNavigationNode.getNextRoute();
      }
    }

    if (this.applicationService.currentSection.YearOfCompletionOption == 'year-not-exact') {
      return this.yearRangeNavigationNode.getNextRoute();
    }

    return this.completionCertificateIssuerNavigationNode.getNextRoute();
  }
}

class YearRangeNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private completionCertificateIssuerNavigationNode: CompletionCertificateIssuerNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.YearOfCompletionRange) {
      return this.getCurrentSectionRouteTo(SectionYearRangeComponent.route);
    }

    return this.completionCertificateIssuerNavigationNode.getNextRoute();
  }
}

class CompletionCertificateIssuerNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private completionCertificateReferenceNavigationNode: CompletionCertificateReferenceNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.CompletionCertificateIssuer) {
      return this.getCurrentSectionRouteTo(CertificateIssuerComponent.route);
    }

    return this.completionCertificateReferenceNavigationNode.getNextRoute();
  }
}

class CompletionCertificateReferenceNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private sectionAddressNavigationNode: SectionAddressNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (!this.applicationService.currentSection.CompletionCertificateReference) {
      return this.getCurrentSectionRouteTo(CertificateNumberComponent.route);
    }

    return this.sectionAddressNavigationNode.getNextRoute();
  }
}

class SectionAddressNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private sectionMoreAddressesNavigationNode: SectionMoreAddressesNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if ((this.applicationService.currentSection.Addresses?.length ?? 0) == 0 || this.applicationService.currentSection.Addresses.filter(x => !x.Postcode).length > 0) {
      return this.getCurrentSectionRouteTo(SectionAddressComponent.route);
    }

    return this.sectionMoreAddressesNavigationNode.getNextRoute();
  }
}

class SectionMoreAddressesNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private addMoreSectionsNavigationNode: AddMoreSectionsNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if ((this.applicationService.currentSection.Addresses.length ?? 0) < 5) {
      return this.getCurrentSectionRouteTo(SectionOtherAddressesComponent.route);
    }

    return this.addMoreSectionsNavigationNode.getNextRoute();
  }
}

class AddMoreSectionsNavigationNode extends BuildingNavigationNode {
  constructor(applicationService: ApplicationService,
    private checkAnswersNavigationNode: CheckAnswersNavigationNode) {
    super(applicationService);
  }

  override getNextRoute(): string {
    if (this.applicationService.model.NumberOfSections == 'two_or_more' && this.applicationService.model.Sections.length <= 1) {
      return this.getCurrentSectionRouteTo(AddMoreSectionsComponent.route);
    }

    return this.checkAnswersNavigationNode.getNextRoute();
  }
}

class CheckAnswersNavigationNode extends BuildingNavigationNode {
  override getNextRoute(): string {
    return SectionCheckAnswersComponent.route;
  }
}