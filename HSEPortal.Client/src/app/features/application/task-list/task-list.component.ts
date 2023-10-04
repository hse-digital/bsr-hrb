import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApplicationService, BuildingApplicationStage, PaymentStatus } from "src/app/services/application.service";
import { PaymentDeclarationComponent } from "../payment/payment-declaration/payment-declaration.component";
import { PaymentModule } from "../payment/payment.module";
import { BuildingSummaryNavigation } from "src/app/features/application/building-summary/building-summary.navigation";
import { AccountablePersonNavigation } from "src/app/features/application/accountable-person/accountable-person.navigation";
import { PageComponent } from "src/app/helpers/page.component";
import { PaymentInvoiceComponent } from "../payment/payment-invoice/payment-invoice.component";
import { PaymentSelectionComponent } from "../payment/payment-selection/payment-selection.component";
import { PaymentInvoiceConfirmationComponent } from "../payment/payment-invoice-confirmation/payment-invoice-confirmation.component";

@Component({
  templateUrl: './task-list.component.html'
})
export class ApplicationTaskListComponent extends PageComponent<void> {
  static route: string = '';
  static title: string = "Registration task list - Register a high-rise building - GOV.UK";

  applicationStatus = BuildingApplicationStage;
  completedSections: number = 0;
  paymentEnum = PaymentStatus;
  paymentStatus?: PaymentStatus;

  constructor(activatedRoute: ActivatedRoute, private buildingNavigation: BuildingSummaryNavigation, private apNavigation: AccountablePersonNavigation) {
    super(activatedRoute);
  }

  checkingStatus = true;

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if (this.containsFlag(BuildingApplicationStage.BlocksInBuildingComplete)) this.completedSections++;
    if (this.containsFlag(BuildingApplicationStage.AccountablePersonsComplete)) {
      await this.getPaymentStatus();
      this.completedSections++;
    }
    if (this.containsFlag(BuildingApplicationStage.PaymentComplete)) this.completedSections++;

    this.checkingStatus = false;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> { }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.applicationService.model?.id !== undefined && this.applicationService.model?.id == routeSnapshot.params['id'];
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async navigateToSections() {
    const route = this.buildingNavigation.getNextRoute();
    await this.navigationService.navigateAppend(route, this.activatedRoute);
  }

  async navigateToPap() {
    const route = this.apNavigation.getNextRoute();
    await this.navigationService.navigateAppend(route, this.activatedRoute);
  }

  navigateToPayment() {
    let appendRoute = PaymentModule.baseRoute;
    if (this.applicationService.model.PaymentType == undefined) {
      appendRoute = `${PaymentModule.baseRoute}/${PaymentDeclarationComponent.route}`;
    } else if (this.applicationService.model.PaymentType == 'invoice') {
      if (this.applicationService.model.PaymentInvoiceDetails?.Status == 'awaiting' || this.applicationService.model.PaymentInvoiceDetails?.Status == 'completed') {
        appendRoute = `${PaymentModule.baseRoute}/${PaymentInvoiceConfirmationComponent.route}`;
      } else {
        appendRoute = `${PaymentModule.baseRoute}/${PaymentInvoiceComponent.route}`;
      }
    } else {
      appendRoute = `${PaymentModule.baseRoute}/${PaymentSelectionComponent.route}`;
    }

    this.navigationService.navigateAppend(appendRoute, this.activatedRoute);
  }

  containsFlag(flag: BuildingApplicationStage) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

  async getPaymentStatus(): Promise<void> {
    var payments = await this.applicationService.getApplicationPayments();

    if (payments?.length > 0) {
      var successfulPayments = payments.filter(x => x.bsr_govukpaystatus == 'success' || x.bsr_govukpaystatus == 'paid');

      if (successfulPayments?.length > 0) {
        var sucesssfulpayment = successfulPayments.find(x => x.bsr_paymentreconciliationstatus !== 760_810_002 && x.bsr_paymentreconciliationstatus !== 760_810_003 && x.bsr_paymentreconciliationstatus !== 760_810_004);
        this.paymentStatus = sucesssfulpayment ? PaymentStatus.Success : PaymentStatus.Failed;

        if (this.paymentStatus == PaymentStatus.Success) {
          this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStage.PaymentComplete;
          await this.applicationService.updateApplication();
        }
      } else if (payments[0].bsr_govukpaystatus == 'open') {
        this.paymentStatus = PaymentStatus.Pending;
      } else {
        this.paymentStatus = PaymentStatus.Failed;
      }
    } else if (this.containsFlag(BuildingApplicationStage.PaymentInProgress)) {
      this.paymentStatus = PaymentStatus.Started;
    }
  }
}
