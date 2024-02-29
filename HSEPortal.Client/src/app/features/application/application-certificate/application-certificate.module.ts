import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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

const routes = new HseRoutes([
  HseRoute.protected(ConfirmInformationBsrHoldsComponent.route, ConfirmInformationBsrHoldsComponent, ConfirmInformationBsrHoldsComponent.title),
  HseRoute.protected(ComplianceNoticeNumbersComponent.route, ComplianceNoticeNumbersComponent, ComplianceNoticeNumbersComponent.title),
  HseRoute.protected(Section89DeclarationComponent.route, Section89DeclarationComponent, Section89DeclarationComponent.title),
  HseRoute.protected(UploadDocumentsComponent.route, UploadDocumentsComponent, UploadDocumentsComponent.title),
  HseRoute.protected(ChargesOverviewComponent.route, ChargesOverviewComponent, ChargesOverviewComponent.title),
  HseRoute.protected(SameInvoiceDetailsComponent.route, SameInvoiceDetailsComponent, SameInvoiceDetailsComponent.title),
]);

@NgModule({
  declarations: [
    ConfirmInformationBsrHoldsComponent,
    ComplianceNoticeNumbersComponent,
    Section89DeclarationComponent,
    UploadDocumentsComponent,
    ChargesOverviewComponent,
    SameInvoiceDetailsComponent,
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
