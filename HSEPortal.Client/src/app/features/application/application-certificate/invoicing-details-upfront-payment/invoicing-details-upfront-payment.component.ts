import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationCertificateStage, ApplicationService, PaymentInvoiceDetails } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SubmittedConfirmationComponent } from '../submitted-confirmation/sumitted-confirmation.component';

@Component({
  templateUrl: './invoicing-details-upfront-payment.component.html',
})
export class InvoicingDetailsUpfrontPaymentComponent extends PageComponent<PaymentInvoiceDetails> {
  static route: string = "invoicing-details-upfront-payment";
  static title: string = "Enter invoicing details for the application charge - building assessment certificate - Register a high-rise building - GOV.UK";

  errorFields: string[] = [];
  applicationCharge: number = 0;
  constructor(public paymentService: PaymentService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {

    this.applicationService.model.ApplicationCertificate!.ApplicationStatus = applicationService.model.ApplicationCertificate!.ApplicationStatus | ApplicationCertificateStage.PaymentInProgress;

    this.model = applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails ?? new PaymentInvoiceDetails();

    const appCharges = await applicationService.getApplicationCost();
    this.applicationCharge = appCharges.CertificateCharges?.ApplicationCharge ?? 0;

    await this.applicationService.updateApplication();
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
    applicationService.model.ApplicationCertificate!.ApplicationInvoiceDetails = this.model;

    if (isSaveAndContinue) {
      applicationService.model.ApplicationCertificate!.ApplicationInvoiceDetails!.Status = 'awaiting';

      await this.applicationService.updateApplication();
      await this.paymentService.createInitialiseCertificateInvoicePayment(this.applicationService.model.id!, this.model!);
    } else {
      await this.applicationService.updateApplication();
    }
  }

  override canAccess(applicationService: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return true;
  }

  emailErrorMessage: string = '';
  override isValid(): boolean {
    this.errorFields = [];

    if (!FieldValidations.IsNotNullOrWhitespace(this.model?.Name))
      this.errorFields.push('Name');

    if (!FieldValidations.IsNotNullOrWhitespace(this.model?.Email)) {
      this.emailErrorMessage = 'Enter the email address that we need to send the invoice to';
      this.errorFields.push('Email');
    } else if (!EmailValidator.isValid(this.model?.Email ?? '')) {
      this.emailErrorMessage = 'You must enter an email address in the correct format, like name@example.com';
      this.errorFields.push('Email');
    }

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
    return this.navigationService.navigateRelative(SubmittedConfirmationComponent.route, this.activatedRoute);
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