import { Component, EventEmitter, Output } from "@angular/core";
import { ApplicationService } from "src/app/services/application.service";

@Component({
    selector: 'application-enterdata',
    templateUrl: './enterdata.component.html'
})
export class ContinueApplicationEnterDataComponent {

    hasErrors = false;
    sendingRequest = false;
    errors = {
        emailAddress: { hasError: false, errorText: '' },
        applicationNumber: { hasError: false, errorText: '' }
    }
    model: { emailAddress?: string, applicationNumber?: string } = {}

    @Output()
    onContinue = new EventEmitter<{ emailAddress: string, applicationNumber: string }>();

    constructor(private applicationService: ApplicationService) { }

    getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
        return this.hasErrors && showError ? errorMessage : undefined;
    }

    async validateAndContinue(): Promise<void> {
        this.sendingRequest = true;

        this.isEmailAddressValid();
        await this.isApplicationNumberValid();

        this.hasErrors = this.errors.emailAddress.hasError || this.errors.applicationNumber.hasError;

        if (!this.hasErrors) {
            await this.applicationService.sendVerificationEmail(this.model.emailAddress!);
            this.onContinue.emit({ emailAddress: this.model.emailAddress!, applicationNumber: this.model.applicationNumber! });
        }        
        
        this.sendingRequest = false;
    }

    async isApplicationNumberValid() {
        this.errors.applicationNumber.hasError = true;
        if (!this.model.applicationNumber) {
            this.errors.applicationNumber.errorText = 'Enter the application number';
        } else if (this.model.applicationNumber.length != 12) {
            this.errors.applicationNumber.errorText = 'Application number must be 12 characters';
        } else if (!(await this.doesApplicationNumberMatchEmail())) {
            this.errors.applicationNumber.errorText = 'Application number doesn\'t match this email address. Enter the correct application number';
        } else {
            this.errors.applicationNumber.hasError = false;
        }
    }

    isEmailAddressValid() {
        this.errors.emailAddress.hasError = false;
        if (!this.model.emailAddress) {
            this.errors.emailAddress.errorText = 'Enter your email address';
            this.errors.emailAddress.hasError = true;
        }
    }

    async doesApplicationNumberMatchEmail(): Promise<boolean> {
        return await this.applicationService.isApplicationNumberValid(this.model.emailAddress!, this.model.applicationNumber!);
    }
}