import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { SectionAddressComponent } from "../address/address.component";
import { CertificateIssuerComponent } from "../certificate-issuer/certificate-issuer.component";
import { PageComponent } from "src/app/helpers/page.component";
import { WhoIssuedCertificateComponent } from "../who-issued-certificate/who-issued-certificate.component";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";

@Component({
    templateUrl: './year-range.component.html'
})
export class SectionYearRangeComponent extends PageComponent<string> {
    static route: string = 'year-range';
    static title: string = "Range of years it was completed in - Register a high-rise building - GOV.UK";
    yearRangeHasErrors = false;

    constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
        super(activatedRoute);
        this.isPageChangingBuildingSummary(SectionYearRangeComponent.route);
    }

    sectionBuildingName() {
        return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
            this.applicationService.currentSection.Name;
    }

    override onInit(applicationService: ApplicationService): void {
        this.model = applicationService.currentSection.YearOfCompletionRange
    }

    override async onSave(applicationService: ApplicationService): Promise<void> {
        applicationService.currentSection.YearOfCompletionRange = this.model;
    }

    override onInitChange(applicationService: ApplicationService): void | Promise<void> {
        if (!this.applicationService.currentChangedSection.SectionModel?.YearOfCompletionRange) this.onInit(this.applicationService);
        else this.model = this.applicationService.currentChangedSection.SectionModel?.YearOfCompletionRange;
    }

    override onChange(applicationService: ApplicationService): void | Promise<void> {
        this.applicationService.currentChangedSection!.SectionModel!.YearOfCompletionRange = this.model;
    }

    override nextChangeRoute(): string {
        let section = new ChangeBuildingSummaryHelper(this.applicationService).getSections()[this.applicationService._currentSectionIndex];
        return this.buildingSummaryNavigation.getNextChangeRoute(section); 
    }

    override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
        return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService) && 
            this.applicationService.currentSection.YearOfCompletionOption == "year-not-exact";
    }

    override isValid(): boolean {
        this.yearRangeHasErrors = !this.model;
        return !this.yearRangeHasErrors;
    }

    override navigateNext(): Promise<boolean> {
        var selectedOption = this.applicationService.currentSection.YearOfCompletionRange;

        if (selectedOption == "not-completed") {
            return this.navigationService.navigateRelative(SectionAddressComponent.route, this.activatedRoute);
        } else if (selectedOption != "2023-onwards") {
            return this.navigationService.navigateRelative(CertificateIssuerComponent.route, this.activatedRoute);
        }

        return this.navigationService.navigateRelative(WhoIssuedCertificateComponent.route, this.activatedRoute);
    }

    get errorMessage() {
        return `Select what range of years ${this.sectionBuildingName()} was completed in`;
    }

}
