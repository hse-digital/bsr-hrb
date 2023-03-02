import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { LeadDetailsComponent } from "../lead-details/lead-details.component";

@Component({
    templateUrl: './lead-name.component.html'
})
export class LeadNameComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'lead-name';

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
        this.updateOnSave = true;
    }

    firstNameInError: boolean = false;
    lastNameInError: boolean = false;

    canContinue() {
        this.firstNameInError = !this.applicationService.currentAccountablePerson.LeadFirstName;
        this.lastNameInError = !this.applicationService.currentAccountablePerson.LeadLastName;

        return !this.firstNameInError && !this.lastNameInError;
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        return navigationService.navigateRelative(LeadDetailsComponent.route, activatedRoute);
    }

}