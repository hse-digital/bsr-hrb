import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from "@angular/core";
import { TitleService } from 'src/app/services/title.service';
import { GovukErrorSummaryComponent } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";

@Component({
  selector: 'application-enterdata',
  templateUrl: './enterdata.component.html'
})
export class ReturningApplicationEnterDataComponent {

  hasErrors = false;
  sendingRequest = false;
  errors = {
    emailAddress: { hasError: false, errorText: '' },
    applicationNumber: { hasError: false, errorText: '' }
  }

  @Input() emailAddress: string | undefined;
  @Output() emailAddressChange = new EventEmitter<string | undefined>();

  @Input() applicationNumber: string | undefined;
  @Output() applicationNumberChange = new EventEmitter<string | undefined>();

  @Output()
  onContinue = new EventEmitter<{ emailAddress: string, applicationNumber: string }>();

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(private applicationService: ApplicationService, private titleService: TitleService) { }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

  async validateAndContinue(): Promise<void> {
    this.sendingRequest = true;

    this.isEmailAddressValid();
    await this.isApplicationNumberValid();

    this.hasErrors = this.errors.emailAddress.hasError || this.errors.applicationNumber.hasError;

    if (!this.hasErrors) {
      await this.applicationService.sendVerificationEmail(this.emailAddress!);
      this.onContinue.emit({ emailAddress: this.emailAddress!, applicationNumber: this.applicationNumber! });
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();      
    }

    this.sendingRequest = false;
  }

  async isApplicationNumberValid() {
    this.errors.applicationNumber.hasError = true;
    if (!this.applicationNumber) {
      this.errors.applicationNumber.errorText = 'Enter the application number';
    } else if (this.applicationNumber.length != 12) {
      this.errors.applicationNumber.errorText = 'Application number must be 12 characters';
    } else if (!(await this.doesApplicationNumberMatchEmail())) {
      this.errors.applicationNumber.errorText = 'Application number doesn\'t match this email address. Enter the correct application number';
    } else {
      this.errors.applicationNumber.hasError = false;
    }
  }

  isEmailAddressValid() {
    this.errors.emailAddress.hasError = false;
    if (!this.emailAddress) {
      this.errors.emailAddress.errorText = 'Enter your email address';
      this.errors.emailAddress.hasError = true;
    }
  }

  async doesApplicationNumberMatchEmail(): Promise<boolean> {
    return await this.applicationService.isApplicationNumberValid(this.emailAddress!, this.applicationNumber!);
  }
}
