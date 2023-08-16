import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { ApplicationService } from "src/app/services/application.service";
import { LeadDetailsComponent } from "../lead-details/lead-details.component";
import { PageComponent } from "src/app/helpers/page.component";

export type AccountableLeadPersonName = { LeadFirstName?: string, LeadLastName?: string }

@Component({
    templateUrl: './lead-name.component.html'
})
export class LeadNameComponent extends PageComponent<AccountableLeadPersonName> {
    static route: string = 'lead-name';
    static title: string = "Who is the PAP organisation lead contact? - Register a high-rise building - GOV.UK";



    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    firstNameInError: boolean = false;
    lastNameInError: boolean = false;

    override onInit(applicationService: ApplicationService): void {
        this.model = {
            LeadFirstName: this.applicationService.currentAccountablePerson.LeadFirstName,
            LeadLastName: this.applicationService.currentAccountablePerson.LeadLastName
        }
    }

    override async onSave(applicationService: ApplicationService): Promise<void> {
        this.applicationService.currentAccountablePerson.LeadFirstName = this.model?.LeadFirstName;
        this.applicationService.currentAccountablePerson.LeadLastName = this.model?.LeadLastName;
    }

    override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
        return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
            && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
    }

    override isValid(): boolean {
        this.firstNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model?.LeadFirstName);
        this.lastNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model?.LeadLastName);

        return !this.firstNameInError && !this.lastNameInError;
    }

    override navigateNext(): Promise<boolean | void> {
        return this.navigationService.navigateRelative(LeadDetailsComponent.route, this.activatedRoute);
    }

}
