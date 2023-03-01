import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { EmailValidator } from "src/app/helpers/validators/email-validator";
import { PhoneNumberValidator } from "src/app/helpers/validators/phone-number-validator";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    templateUrl: './pap-details.component.html'
})
export class PapDetailsComponent extends BaseComponent implements IHasNextPage, OnInit {
    static route: string = 'pap-details';

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    papName?: string;
    ngOnInit(): void {
        this.papName = `${this.applicationService.currentAccountablePerson.FirstName} ${this.applicationService.currentAccountablePerson.LastName}`;
    }

    errors = {
        contactDetailsAreEmpty: false,
        email: { hasErrors: false, errorText: '' },
        phoneNumber: { hasErrors: false, errorText: '' }
    };

    canContinue(): boolean {
        let email = this.applicationService.currentAccountablePerson.Email ?? '';
        let phone = this.applicationService.currentAccountablePerson.PhoneNumber ?? '';
        let canContinue = false;

        if (!email && !phone) {
            this.errors.contactDetailsAreEmpty = true;
        } else {
            this.errors.contactDetailsAreEmpty = false;
            let emailValid = this.isEmailValid(email);
            let phoneValid = this.isPhoneNumberValid(phone);
            canContinue = emailValid && phoneValid;
        }

        return canContinue;
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    isEmailValid(email: string): boolean {
        let emailValidator = new EmailValidator();
        this.errors.email.hasErrors = true;
        if (!email) {
            this.errors.email.errorText = 'Enter your email address';
        } else if (!emailValidator.isValid(email)) {
            this.errors.email.errorText = 'You must enter an email address in the correct format, for example \'name@example.com\'';
        } else {
            this.errors.email.hasErrors = false;
        }

        return !this.errors.email.hasErrors;
    }

    isPhoneNumberValid(phone: string) {
        let phoneValidator = new PhoneNumberValidator();
        this.errors.phoneNumber.hasErrors = true;
        if (!phone) {
            this.errors.phoneNumber.errorText = 'Enter your telephone number';
        } else if (!phoneValidator.isValid(phone)) {
            this.errors.phoneNumber.errorText = 'You must enter a UK telephone number. For example, \'01632 960 001\', \'07700 900 982\' or \'+44 808 157 0192\'';
        } else {
            this.errors.phoneNumber.hasErrors = false;
        }
        return !this.errors.phoneNumber.hasErrors;
    }

}