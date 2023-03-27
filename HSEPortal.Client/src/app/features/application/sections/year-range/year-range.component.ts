import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { CertificateIssuerComponent } from "../certificate-issuer/certificate-issuer.component";

@Component({
    templateUrl: './year-range.component.html'
})
export class SectionYearRangeComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'year-range';
    static title: string = "What year range was the section originally built?- Register a high-rise building - GOV.UK";

    yearRangeHasErrors = false;
    @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
        super(router, applicationService, navigationService, activatedRoute, titleService);
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

    override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
        return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService) && 
            this.applicationService.currentSection.YearOfCompletionOption == "year-not-exact";
    }

}
