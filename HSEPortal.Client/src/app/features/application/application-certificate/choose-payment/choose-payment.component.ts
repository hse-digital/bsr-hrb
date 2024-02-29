import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SameInvoiceDetailsComponent } from '../same-invoice-details/same-invoice-details.component';

@Component({
  templateUrl: './choose-payment.component.html',
})
export class ChoosePaymentComponent extends PageComponent<string> {
  static route: string = "choose-payment";
  static title: string = "How do you want to pay the application charge? - building assessment certificate - Register a high-rise building - GOV.UK";

  modelValid: boolean = true;
  applicationCharge?: number;

  constructor(public paymentService: PaymentService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.model = applicationService.model.ApplicationCertificate?.PaymentType;

    const appCharges = await applicationService.getApplicationCost();
    this.applicationCharge = appCharges.CertificateCharges?.ApplicationCharge ?? 0;
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
    applicationService.model.ApplicationCertificate!.PaymentType = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    this.modelValid = this.model == 'card' || this.model == 'invoice';
    return this.modelValid;
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.model == 'card') {
      var paymentResponse = await this.paymentService.InitialiseApplicationCertificatePayment(this.applicationService.model);
      this.applicationService.updateApplication();

      if (typeof window !== 'undefined') {
        window.location.href = paymentResponse.PaymentLink!;
      }
    } else {
      await this.navigationService.navigateRelative(SameInvoiceDetailsComponent.route, this.activatedRoute);
    }

    return true;
  }

  select() : void {
    this.hasErrors = false;
    this.modelValid = true;
  }
}