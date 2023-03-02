import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    templateUrl: './year-of-completion.component.html'
})
export class SectionYearOfCompletionComponent extends BaseComponent implements IHasNextPage {
    static route: string = 'year-of-completion';
    yearOfCompletionHasErrors = false;
    errorMessage = 'Select one of the options below';

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    canContinue(): boolean {
        let yearOfCompletionOption = this.applicationService.currentSection.YearOfCompletionOption;
        let yearOfCompletion = this.applicationService.currentSection.YearOfCompletion;

        if (!yearOfCompletionOption) {
            this.yearOfCompletionHasErrors = true;
        } else if (yearOfCompletionOption == 'year-exact') {
            if (!yearOfCompletion) {
                this.errorMessage = 'Exact year cannot be blank';
                this.yearOfCompletionHasErrors = true;
            } else if (Number(yearOfCompletion) > new Date().getFullYear()) {
                this.errorMessage = 'Exact year must be this year or in the past';
                this.yearOfCompletionHasErrors = true;
            } else if (yearOfCompletion.length != 4) {
                this.errorMessage = 'Exact year must be a real year';
                this.yearOfCompletionHasErrors = true;
            } else if (!Number(yearOfCompletion)) {
                this.errorMessage = 'Exact year must be a number';
                this.yearOfCompletionHasErrors = true;
            }
        }

        return !this.yearOfCompletionHasErrors;
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        let route = 'address';
        if (this.applicationService.currentSection.YearOfCompletionOption == 'year-not-exact') {
            route = 'year-range';
        }

        return navigationService.navigateRelative(route, activatedRoute);
    }

    radioChange() {
        if (this.applicationService.currentSection.YearOfCompletionOption != 'year-exact') {
            this.applicationService.currentSection.YearOfCompletion = undefined;
        }
    }
}