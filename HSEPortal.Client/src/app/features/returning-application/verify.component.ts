import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from "@angular/core";
import { GovukErrorSummaryComponent } from "hse-angular";
import { ApplicationService, BuildingApplicationStage } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'application-verify',
  templateUrl: './verify.component.html'
})
export class ReturningApplicationVerifyComponent implements OnInit {

  static title: string = "Enter security code - Register a high-rise building - GOV.UK";

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

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private titleService: TitleService) { }

  ngOnInit() {
    this.titleService.setTitle(ReturningApplicationVerifyComponent.title);
  }

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
      this.titleService.setTitleError();
    }

    this.sendingRequest = false;
  }

  showResendStep() {
    this.onResendClicked.emit();
  }

  private async doesSecurityCodeMatch(): Promise<boolean> {
    try {
      await this.applicationService.continueApplication(this.applicationNumber, this.emailAddress, this.securityCode!);

      var applicationStatus = this.applicationService.model.ApplicationStatus;
      if ((applicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete) {
        this.navigationService.navigate(`application/${this.applicationNumber}/application-completed`);
      } else if ((applicationStatus & BuildingApplicationStage.PaymentComplete) == BuildingApplicationStage.PaymentComplete) {
        this.navigationService.navigate(`application/${this.applicationNumber}/kbi`);
      } else {
        this.navigationService.navigate(`application/${this.applicationNumber}`);
      }

      return true;
    } catch {
      return false;
    }
  }
}
