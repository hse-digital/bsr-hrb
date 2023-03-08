import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { CertificateIssuerComponent } from "../certificate-issuer/certificate-issuer.component";

@Component({
    templateUrl: './year-range.component.html'
})
export class SectionYearRangeComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'year-range';

    yearRangeHasErrors = false;
    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    canContinue(): boolean {
        this.yearRangeHasErrors = !this.applicationService.currentSection.YearOfCompletionRange;
        return !this.yearRangeHasErrors;
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        return navigationService.navigateRelative(CertificateIssuerComponent.route, activatedRoute);
    }

    sectionBuildingName() {
      return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
        this.applicationService.currentSection.Name;
    }
}