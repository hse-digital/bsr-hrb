import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
    templateUrl: './contact-email-validation.component.html'
})
export class ContactEmailValidationComponent extends BaseComponent {
    static route: string = "email-code";

    otpToken = "";
    otpError = false;
    sendingRequest = false;

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    canContinue(): boolean {
        return this.otpToken !== undefined && this.otpToken.length == 6;
    }

    getOtpError() {
        return this.otpError ? 'Enter the correct security code' : 'You must enter your 6 digit security code';
    }

    override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
        return this.applicationService.model.ContactEmailAddress !== undefined;
    }

    override async saveAndContinue(): Promise<any> {
        this.hasErrors = !this.canContinue();
        if (!this.hasErrors) {
            try {
                this.sendingRequest = true;
                await this.applicationService.validateOTPToken(this.otpToken, this.applicationService.model.ContactEmailAddress!);
                await this.applicationService.registerNewBuildingApplication();
                await this.navigationService.navigate(`application/${this.applicationService.model.id}/sections`);
            } catch {
                this.sendingRequest = false;
                this.hasErrors = true;
                this.otpError = true;
            }

        }
    }
}

