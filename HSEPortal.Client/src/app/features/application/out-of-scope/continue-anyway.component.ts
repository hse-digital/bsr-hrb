import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountablePersonModule } from "../accountable-person/accountable-person.module";
import { AccountablePersonComponent } from "../accountable-person/accountable-person/accountable-person.component";

@Component({
    templateUrl: './continue-anyway.component.html'
})
export class ContinueAnywayComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'continue-anyway';

    maxCharacters = 300;
    tooManyCharacters: boolean = false;
    emptyReason = true;

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    updateCharacters() {
        this.tooManyCharacters = (this.applicationService.model.OutOfScopeContinueReason?.length ?? 0) > this.maxCharacters;
    }

    canContinue(): boolean {
        this.emptyReason = !this.applicationService.model.OutOfScopeContinueReason || this.applicationService.model.OutOfScopeContinueReason.length == 0;
        return !this.emptyReason;
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        return navigationService.navigateRelative(`${AccountablePersonModule.baseRoute}/${AccountablePersonComponent.route}`, activatedRoute);
    }

}