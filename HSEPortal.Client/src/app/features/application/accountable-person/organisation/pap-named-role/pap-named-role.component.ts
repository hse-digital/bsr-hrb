import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddAccountablePersonComponent } from "../../add-accountable-person/add-accountable-person.component";

@Component({
    templateUrl: './pap-named-role.component.html'
})
export class PapNamedRoleComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'pap-named-role';

    namedRoleHasErrors = false;
    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    canContinue(): boolean {
        this.namedRoleHasErrors = !this.applicationService.currentAccountablePerson.LeadJobRole;
        return !this.namedRoleHasErrors;
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        return navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, activatedRoute);
    }

}