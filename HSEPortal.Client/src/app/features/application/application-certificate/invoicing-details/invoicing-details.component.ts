import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationCertificateStage, ApplicationService, PaymentInvoiceDetails } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  templateUrl: './invoicing-details.component.html',
})
export class InvoicingDetailsComponent extends PageComponent<PaymentInvoiceDetails> {
  static route: string = "invoicing-details";
  static title: string = "Enter invoicing details for ongoing charges - building assessment certificate - Register a high-rise building - GOV.UK";

  firstName?: string;
  lastName?: string;
  errorFields: string[] = [];
  applicationCharge: number = 0;
  constructor(public paymentService: PaymentService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    // TODO do we need ApplicationCertificateStage?
    // this.applicationService.model.ApplicationStatus = applicationService.model.ApplicationStatus | BuildingApplicationStage.PaymentInProgress;
    this.applicationService.model.ApplicationCertificate!.ApplicationStatus = applicationService.model.ApplicationCertificate!.ApplicationStatus | ApplicationCertificateStage.PaymentInProgress;
        
    this.model = applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails ?? new PaymentInvoiceDetails();
    
    const names = this.model.Name?.split(' ', 2);
    if (names && names.length > 0) {
      this.firstName = names[0];
      this.lastName = names[1];
    }
    
    const appCharges = await applicationService.getApplicationCost();
    this.applicationCharge = appCharges.CertificateCharges?.ApplicationCharge ?? 0;

    await this.applicationService.updateApplication();
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
    this.model!.Name = `${this.firstName?.trim()} ${this.lastName?.trim()}`;

    applicationService.model.ApplicationCertificate!.OngoingChangesInvoiceDetails = this.model;

    if (isSaveAndContinue) {
      applicationService.model.ApplicationCertificate!.OngoingChangesInvoiceDetails!.Status = 'awaiting';

      await this.applicationService.updateApplication();
      await this.paymentService.createInitialiseCertificateInvoicePayment(this.applicationService.model.id!, this.model!);
    } else {
      await this.applicationService.updateApplication();
    }
  }

  override canAccess(applicationService: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return true;
    // TODO
    // return (applicationService.model.ApplicationCertificate!.ApplicationStatus & ApplicationCertificateStage.PaymentInProgress) == ApplicationCertificateStage.PaymentInProgress &&
    //   applicationService.model.PaymentType == 'invoice';
  }

  emailErrorMessage: string = '';
  override isValid(): boolean {
    this.errorFields = [];

    if (!FieldValidations.IsNotNullOrWhitespace(this.firstName))
      this.errorFields.push('FirstName');

    if (!FieldValidations.IsNotNullOrWhitespace(this.lastName))
      this.errorFields.push('LastName');

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
    return Promise.resolve(true); // check answers page 21447
    // return this.navigationService.navigateRelative(PaymentInvoiceConfirmationComponent.route, this.activatedRoute);
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