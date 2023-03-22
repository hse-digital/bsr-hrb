import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { ApHelper } from "src/app/helpers/ap-helper";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { LeadDetailsComponent } from "../lead-details/lead-details.component";

@Component({
    templateUrl: './lead-name.component.html'
})
export class LeadNameComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'lead-name';
    static title: string = "Who is the PAP organisation lead contact? - Register a high-rise building - GOV.UK";

    @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
        super(router, applicationService, navigationService, activatedRoute, titleService);
    }

    firstNameInError: boolean = false;
    lastNameInError: boolean = false;

    canContinue() {
        this.firstNameInError = !FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentAccountablePerson.LeadFirstName);
        this.lastNameInError = !FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentAccountablePerson.LeadLastName);

        return !this.firstNameInError && !this.lastNameInError;
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        return navigationService.navigateRelative(LeadDetailsComponent.route, activatedRoute);
    }

    override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
        return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
            && ApHelper.isOrganisation(this.applicationService);
    }

}
