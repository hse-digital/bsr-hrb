import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, PaymentInvoiceDetails } from 'src/app/services/application.service';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

@Component({
  templateUrl: './same-invoice-details.component.html'
})
export class SameInvoiceDetailsComponent extends PageComponent<string> {
  static route: string = 'same-invoice-details';
  static title: string = "Where shall we issue the application charge invoice to? - building assessment certificate - Register a high-rise building - GOV.UK";

  invoiceEmail?: string;
  orderNumber?: string;
  hint?: string; 
  modelValid: boolean = true;
  applicationInvoiceDetails?: PaymentInvoiceDetails;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {

    this.invoiceEmail = applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.Email;
    this.orderNumber = applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.OrderNumber;

    if (this.invoiceEmail && this.orderNumber) {
      this.hint = `Email address: ${this.invoiceEmail} Purchase order number: ${this.orderNumber}.`;
    }

    if (applicationService.model.ApplicationCertificate?.UseSameAsOngoingInvoiceDetails != undefined) {
      this.model = applicationService.model.ApplicationCertificate?.UseSameAsOngoingInvoiceDetails
        ? 'same-invoice-details'
        : 'new-details';
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {

    const useSame = this.model === 'same-invoice-details';
    if (useSame) {
      applicationService.model.ApplicationCertificate!.ApplicationInvoiceDetails 
        = applicationService.model.ApplicationCertificate!.OngoingChangesInvoiceDetails;
    } 
    else if (applicationService.model.ApplicationCertificate!.ApplicationInvoiceDetails == undefined) {
        applicationService.model.ApplicationCertificate!.ApplicationInvoiceDetails = new PaymentInvoiceDetails();
    }
    applicationService.model.ApplicationCertificate!.UseSameAsOngoingInvoiceDetails = useSame;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    this.modelValid = FieldValidations.IsNotNullOrWhitespace(this.model);
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean | void> {
      return Promise.resolve(true);
  }

  select() {
    // clear errors
    this.modelValid = true;
    this.hasErrors = false;
  }
}
