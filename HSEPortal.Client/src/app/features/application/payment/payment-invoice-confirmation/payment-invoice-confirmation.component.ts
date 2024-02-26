import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStage } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentInvoiceComponent } from '../payment-invoice/payment-invoice.component';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { KbiModule } from 'src/app/features/kbi/kbi.module';

@Component({
  templateUrl: './payment-invoice-confirmation.component.html',
})
export class PaymentInvoiceConfirmationComponent extends PageComponent<string> {
  static route: string = "invoice-confirmation";
  static title: string = "Awaiting payment for registration application - Register a high-rise building - GOV.UK";
  papIsIndividual: boolean = false;
  submittionDate?: number;

  constructor(public paymentService: PaymentService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.submittionDate = Date.now();
    this.model = applicationService.model.PaymentType;
    applicationService.model.PaymentInvoiceDetails!.Status = 'awaiting';
    await this.applicationService.updateApplication();

    this.sendApplicationDataToBroadcastChannel();
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
    applicationService.model.PaymentType = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return (applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentInProgress) == BuildingApplicationStage.PaymentInProgress;
  }

  override isValid(): boolean {
    return this.model !== void 0;
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.model == 'card') {
      var paymentResponse = await this.paymentService.InitialisePayment(this.applicationService.model);
      this.applicationService.updateApplication();

      if (typeof window !== 'undefined') {
        window.location.href = paymentResponse.PaymentLink!;
      }
    } else {
      await this.navigationService.navigateRelative(PaymentInvoiceComponent.route, this.activatedRoute);
    }

    return true;
  }

  async continueToKbi() {
    await this.navigationService.navigateRelative(`../${KbiModule.baseRoute}`, this.activatedRoute);
  }

  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel(this.applicationService.model.id!)
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
  }

  notPap() {
    var pap = this.applicationService.currentVersion.AccountablePersons[0]; 

    this.papIsIndividual = pap.IsPrincipal == "no" && pap.Type == "individual";

    return (pap.IsPrincipal == 'no' && pap.Type == 'individual') ||
      (pap.Type == 'organisation' && (pap.Role == 'registering_for' || pap.Role == 'employee'));
  }

  get28DaysAfterSubmittionDate() {
    let date = new Date(this.submittionDate!);
    return date!.setDate(date!.getDate() + 28);
  }
}