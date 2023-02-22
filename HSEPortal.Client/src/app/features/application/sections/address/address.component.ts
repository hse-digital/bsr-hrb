import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    templateUrl: './address.component.html'
})
export class SectionAddressComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'number-of-sections';

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    canContinue(): boolean {
        throw new Error("Method not implemented.");
    }
    
    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}