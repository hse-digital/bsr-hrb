import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStatus, PaymentInvoiceDetails } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentOrderNumberDetailsComponent } from '../payment-order-number-details/payment-order-number-details.component';
import { PaymentInvoiceConfirmationComponent } from '../payment-invoice-confirmation/payment-invoice-confirmation.component';

@Component({
  templateUrl: './payment-invoice.component.html',
})
export class PaymentInvoiceComponent extends PageComponent<PaymentInvoiceDetails> {
  static route: string = "invoice";
  static title: string = "Choose payment method - Register a high-rise building - GOV.UK";

  errorFields: string[] = [];
  applicationCost: number = 0;
  constructor(public paymentService: PaymentService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.ApplicationStatus = applicationService.model.ApplicationStatus | BuildingApplicationStatus.PaymentInProgress;
    this.model = applicationService.model.PaymentInvoiceDetails ?? new PaymentInvoiceDetails();
    this.applicationCost = await applicationService.getApplicationCost();

    await this.applicationService.updateApplication();
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.PaymentInvoiceDetails = this.model;
    applicationService.model.PaymentInvoiceDetails!.Status = 'awaiting';
    await this.applicationService.updateApplication();
    
    await applicationService.createInvoicePayment(this.model!);
  }

  override canAccess(applicationService: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return (applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentInProgress) == BuildingApplicationStatus.PaymentInProgress &&
      applicationService.model.PaymentType == 'invoice';
  }

  override isValid(): boolean {
    this.errorFields = [];

    if (!FieldValidations.IsNotNullOrWhitespace(this.model!.Name))
      this.errorFields.push('Name');

    if (!EmailValidator.isValid(this.model?.Email ?? ''))
      this.errorFields.push('Email');

    if (!FieldValidations.IsNotNullOrWhitespace(this.model?.AddressLine1))
      this.errorFields.push('AddressLine1');

    if (!FieldValidations.IsNotNullOrWhitespace(this.model?.Town))
      this.errorFields.push('Town');

    if (!FieldValidations.IsNotNullOrWhitespace(this.model?.Postcode))
      this.errorFields.push('Postcode');

    if (!FieldValidations.IsNotNullOrWhitespace(this.model?.OrderNumberOption))
      this.errorFields.push('OrderNumberOption');

    if (!(this.model?.OrderNumberOption != 'have' || FieldValidations.IsNotNullOrWhitespace(this.model.OrderNumber)))
      this.errorFields.push('OrderNumber');

    return this.errorFields.length == 0;
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.model?.OrderNumberOption == 'need') {
      return this.navigationService.navigateRelative(PaymentOrderNumberDetailsComponent.route, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(PaymentInvoiceConfirmationComponent.route, this.activatedRoute);
  }

  hasError(fieldName: string): boolean {
    return this.errorFields.indexOf(fieldName) > -1;
  }

  updateOrderNumber() {
    if (this.model?.OrderNumberOption != 'have') {
      this.model!.OrderNumber = undefined;
    }
  }
}