import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { SectionAddressComponent } from "../address/address.component";
import { CertificateIssuerComponent } from "../certificate-issuer/certificate-issuer.component";
import { PageComponent } from "src/app/helpers/page.component";

@Component({
    templateUrl: './year-range.component.html'
})
export class SectionYearRangeComponent extends PageComponent<string> {
    static route: string = 'year-range';
    static title: string = "Range of years it was completed in - Register a high-rise building - GOV.UK";
    yearRangeHasErrors = false;


    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
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
        if (["Before-1900","1901-to-1955","1956-to-1969","1970-to-1984"].indexOf(selectedOption!) > -1) {
            return this.navigationService.navigateRelative(SectionAddressComponent.route, this.activatedRoute);
        }

        return this.navigationService.navigateRelative(CertificateIssuerComponent.route, this.activatedRoute);
    }
}
