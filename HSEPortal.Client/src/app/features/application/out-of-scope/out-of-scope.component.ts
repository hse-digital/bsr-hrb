import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { ContinueAnywayComponent } from "./continue-anyway.component";

@Component({
    templateUrl: 'out-of-scope.component.html'
})
export class BuildingOutOfScopeComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'out-of-scope';

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    canContinue(): boolean {
        return true;
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        return navigationService.navigateRelative(ContinueAnywayComponent.route, activatedRoute);
    }

}
