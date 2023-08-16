import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentInvoiceComponent } from '../payment-invoice/payment-invoice.component';

@Component({
  templateUrl: './payment-order-number-details.component.html',
})
export class PaymentOrderNumberDetailsComponent extends PageComponent<string> {
  static route: string = "order-number-details";
  static title: string = "Getting a purchase order number - Register a high-rise building - GOV.UK";
  applicationCost: number = 0;

  constructor(public paymentService: PaymentService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.applicationCost = await applicationService.getApplicationCost();
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return applicationService.model.PaymentInvoiceDetails !== void 0;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return Promise.resolve(true);
  }
}