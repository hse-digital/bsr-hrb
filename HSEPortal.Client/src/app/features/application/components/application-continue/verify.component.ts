import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: 'application-verify',
    templateUrl: './verify.component.html'
})
export class ContinueApplicationVerifyComponent {

    @Input() emailAddress!: string;
    @Input() applicationNumber!: string;
    @Output() onResendClicked = new EventEmitter();

    sendingRequest = false;
    hasErrors = false;
    securityCode?: string;
    errors = {
        securityCode: { hasError: false, errorText: '' }
    }

    constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activateRouted: ActivatedRoute) { }

    getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
        return this.hasErrors && showError ? errorMessage : undefined;
    }

    async validateAndContinue() {
        this.sendingRequest = true;

        this.errors.securityCode.hasError = true;
        if (!this.securityCode) {
            this.errors.securityCode.errorText = 'Enter the security code';
        } else if (!Number(this.securityCode) || this.securityCode.length != 6) {
            this.errors.securityCode.errorText = 'Security code must be a 6 digit number';
        } else if (!(await this.doesSecurityCodeMatch())) {
            this.errors.securityCode.errorText = 'Enter the correct security code';
        } else {
            this.errors.securityCode.hasError = false;
        }

        this.hasErrors = this.errors.securityCode.hasError;
        this.sendingRequest = false;
    }

    showResendStep() {
        this.onResendClicked.emit();
    }

    private async doesSecurityCodeMatch(): Promise<boolean> {
        try {
            await this.applicationService.validateOTPToken(this.securityCode!, this.emailAddress);
            await this.applicationService.continueApplication(this.applicationNumber, this.emailAddress, this.securityCode!);
            this.navigationService.navigateRelative(`${this.applicationNumber}/sections`, this.activateRouted);
            return true;
        } catch {
            return false;
        }
    }
}