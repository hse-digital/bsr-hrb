import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    templateUrl: './other-addresses.component.html',
})
export class SectionOtherAddressesComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'other-addresses';

    hasMoreAddressesError = false;
    hasMoreAddresses?: string;
    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    canContinue(): boolean {
        this.hasMoreAddressesError = !this.hasMoreAddresses;
        return !this.hasMoreAddressesError;
    }
    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}