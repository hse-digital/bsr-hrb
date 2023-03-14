import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  selector: 'application-verify',
  templateUrl: './verify.component.html'
})
export class ReturningApplicationVerifyComponent {

  @Input() emailAddress!: string;
  @Input() applicationNumber!: string;
  @Output() onResendClicked = new EventEmitter();

  sendingRequest = false;
  hasErrors = false;
  securityCode?: string;
  errors = {
    securityCode: { hasError: false, errorText: '' }
  }

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService) { }

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

    if (this.hasErrors) {
      this.summaryError?.first?.focus();
    }

    this.sendingRequest = false;
  }

  showResendStep() {
    this.onResendClicked.emit();
  }

  private async doesSecurityCodeMatch(): Promise<boolean> {
    try {
      await this.applicationService.validateOTPToken(this.securityCode!, this.emailAddress);
      await this.applicationService.continueApplication(this.applicationNumber, this.emailAddress, this.securityCode!);
      this.navigationService.navigate(`application/${this.applicationNumber}`);

      return true;
    } catch {
      return false;
    }
  }
}
