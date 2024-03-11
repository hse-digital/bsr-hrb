import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from "src/app/helpers/page.component";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { ApplicationService } from "src/app/services/application.service";
import { PaymentService } from "src/app/services/payment.service";
import { DeclarationComponent } from "../declaration/declaration.component";

@Component({
  templateUrl: './check-answers.component.html'
})
export class CheckAnswersComponent extends PageComponent<void> {
  static route: string = 'certificate-check-answers';
  static title: string = 'Check your answers for your building assessment certificate application - Register a high-rise building - GOV.UK';

  constructor(public paymentService: PaymentService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): Promise<void> {
    await this.applicationService.updateBacApplication();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.Name) &&
      FieldValidations.IsNotNullOrWhitespace(applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.Email) &&
      FieldValidations.IsNotNullOrWhitespace(applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.AddressLine1) &&
      FieldValidations.IsNotNullOrWhitespace(applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.Town) &&
      FieldValidations.IsNotNullOrWhitespace(applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.Postcode);
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(DeclarationComponent.route, this.activatedRoute);
  }

  getNoticeNumbers() {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.ComplianceNoticeNumbers) ? this.applicationService.model.ApplicationCertificate?.ComplianceNoticeNumbers : 'Not provided'
  }

  navigateTo(url: string) {
    this.navigationService.navigateRelative(url, this.activatedRoute, { return: CheckAnswersComponent.route });
  }

  getFileNames() {
    return this.applicationService.model.ApplicationCertificate?.Files?.map(f => f.Filename);
  }

  getAddress() {
    var invoiceDetails = this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails;
    var addressParts = [invoiceDetails?.AddressLine1, invoiceDetails?.AddressLine2, invoiceDetails?.Postcode, invoiceDetails?.Town];

    return addressParts.filter(x => x).join(', ');
  }

  getOrderOption() {
    if (this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.OrderNumberOption == 'noneed') {
      return 'Not provided';
    }

    return 'Yes - I have a purchase order number';
  }

  showOrderNumber() {
    return this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails?.OrderNumberOption == "have";
  }
}