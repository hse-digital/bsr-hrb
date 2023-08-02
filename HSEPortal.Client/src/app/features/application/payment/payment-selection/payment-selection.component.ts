import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentInvoiceComponent } from '../payment-invoice/payment-invoice.component';

@Component({
  templateUrl: './payment-selection.component.html',
})
export class PaymentSelectionComponent extends PageComponent<string> {
  static route: string = "select";
  static title: string = "Choose payment method - Register a high-rise building - GOV.UK";

  constructor(public paymentService: PaymentService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.model = applicationService.model.PaymentType;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.PaymentType = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return (applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentInProgress) == BuildingApplicationStatus.PaymentInProgress;
  }

  override isValid(): boolean {
    return this.model == 'card' || this.model == 'invoice';
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.model == 'card') {
      var paymentResponse = await this.paymentService.InitialisePayment(this.applicationService.model);
      this.applicationService.updateApplication();

      if (typeof window !== 'undefined') {
        window.location.href = paymentResponse.PaymentLink;
      }
    } else {
      await this.navigationService.navigateRelative(PaymentInvoiceComponent.route, this.activatedRoute);
    }

    return true;
  }
}