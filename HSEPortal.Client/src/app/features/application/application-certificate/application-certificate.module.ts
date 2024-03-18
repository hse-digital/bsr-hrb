import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { HseAngularModule } from 'hse-angular';
import { HseRoute, HseRoutes } from 'src/app/services/hse.route';

import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ConfirmInformationBsrHoldsComponent } from './confirm-information-bsr-holds/confirm-information-bsr-holds.component';
import { ComplianceNoticeNumbersComponent } from './compliance-notice-numbers/compliance-notice-numbers.component';
import { Section89DeclarationComponent } from './section-89-declaration/section-89-declaration.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { ChargesOverviewComponent } from './charges-overview/charges-overview.component';
import { SameInvoiceDetailsComponent } from './same-invoice-details/same-invoice-details.component';
import { ChoosePaymentComponent } from './choose-payment/choose-payment.component';
import { InvoicingDetailsComponent } from './invoicing-details/invoicing-details.component';
import { DeclarationComponent } from './declaration/declaration.component';
import { CheckAnswersComponent } from './check-answers/check-answers.component';
import { InvoicingDetailsUpfrontPaymentComponent } from './invoicing-details-upfront-payment/invoicing-details-upfront-payment.component';
import { SubmittedConfirmationComponent } from './submitted-confirmation/sumitted-confirmation.component';
import { BacService } from './bac.service';
import { PasswordProtectionComponent } from '../../password-protection/password-protection.component';

const bacGuard = async (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  var service = inject(BacService);
  var router = inject(Router);

  var canAccess = await service.canAccess();
  if (!canAccess) {
    router.navigate([`/${PasswordProtectionComponent.route}`], { queryParams: { 'returnUrl': state.url }, state: { 'passwordFeature': "BAC_SERVICE" } });
  }

  return canAccess;
};

const routes = new HseRoutes([
  HseRoute.protected(ConfirmInformationBsrHoldsComponent.route, ConfirmInformationBsrHoldsComponent, ConfirmInformationBsrHoldsComponent.title, [bacGuard]),
  HseRoute.protected(ComplianceNoticeNumbersComponent.route, ComplianceNoticeNumbersComponent, ComplianceNoticeNumbersComponent.title, [bacGuard]),
  HseRoute.protected(Section89DeclarationComponent.route, Section89DeclarationComponent, Section89DeclarationComponent.title, [bacGuard]),
  HseRoute.protected(UploadDocumentsComponent.route, UploadDocumentsComponent, UploadDocumentsComponent.title, [bacGuard]),
  HseRoute.protected(ChargesOverviewComponent.route, ChargesOverviewComponent, ChargesOverviewComponent.title, [bacGuard]),
  HseRoute.protected(SameInvoiceDetailsComponent.route, SameInvoiceDetailsComponent, SameInvoiceDetailsComponent.title, [bacGuard]),
  HseRoute.protected(ChoosePaymentComponent.route, ChoosePaymentComponent, ChoosePaymentComponent.title, [bacGuard]),
  HseRoute.protected(InvoicingDetailsComponent.route, InvoicingDetailsComponent, InvoicingDetailsComponent.title, [bacGuard]),
  HseRoute.protected(CheckAnswersComponent.route, CheckAnswersComponent, CheckAnswersComponent.title, [bacGuard]),
  HseRoute.protected(DeclarationComponent.route, DeclarationComponent, DeclarationComponent.title, [bacGuard]),
  HseRoute.protected(InvoicingDetailsUpfrontPaymentComponent.route, InvoicingDetailsUpfrontPaymentComponent, InvoicingDetailsUpfrontPaymentComponent.title, [bacGuard]),
  HseRoute.protected(SubmittedConfirmationComponent.route, SubmittedConfirmationComponent, SubmittedConfirmationComponent.title, [bacGuard]),
]);

@NgModule({
  declarations: [
    ConfirmInformationBsrHoldsComponent,
    ComplianceNoticeNumbersComponent,
    Section89DeclarationComponent,
    UploadDocumentsComponent,
    ChargesOverviewComponent,
    SameInvoiceDetailsComponent,
    ChoosePaymentComponent,
    InvoicingDetailsComponent,
    CheckAnswersComponent,
    DeclarationComponent,
    InvoicingDetailsUpfrontPaymentComponent,
    SubmittedConfirmationComponent,
  ],
  providers: [...routes.getProviders()],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
  ],
})
export class ApplicationCertificateModule {
  static baseRoute: string = 'certificate';
}
