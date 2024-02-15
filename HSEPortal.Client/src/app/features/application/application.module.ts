import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { SummaryPageComponent } from "src/app/features/application/summary-page/summary-page.component";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { PipesModule } from "src/app/pipes/pipes.module";
import { AccountablePersonModule } from "./accountable-person/accountable-person.module";
import { ApplicationCompletedComponent } from "./application-completed/application-completed.component";
import { NumberOfSectionsComponment } from "./building-summary/number-of-sections/number-of-sections.component";
import { BuildingOutOfScopeComponent } from "./out-of-scope/out-of-scope.component";
import { PaymentModule } from "./payment/payment.module";
import { BuildingSummaryModule } from "./building-summary/building-summary.module";
import { AccountablePersonSummaryComponent } from "./summary-page/accountable-person-summary/accountable-person-summary.component";
import { IndividualComponent } from "./summary-page/accountable-person-summary/individual.component";
import { OrganisationComponent } from "./summary-page/accountable-person-summary/organisation.component";
import { SectionSummaryComponent } from "./summary-page/section-summary.component";
import { ApplicationTaskListComponent } from "./task-list/task-list.component";
import { AccountablePersonNavigation } from "src/app/features/application/accountable-person/accountable-person.navigation";
import { KbiModule } from "../kbi/kbi.module";
import { KbiNavigation } from "src/app/features/kbi/kbi.navigation.ts.service";
import { RegistrationAmendmentsModule } from "../registration-amendments/registration-amendments.module";
import { FormsModule } from "@angular/forms";
import { SafetyCaseReportModule } from './safety-case-report/safety-case-report.module';
import { ApplicationCertificateModule } from './application-certificate/application-certificate.module';

const routes = new HseRoutes([
  HseRoute.protected(ApplicationTaskListComponent.route, ApplicationTaskListComponent, ApplicationTaskListComponent.title),
  HseRoute.protected(NumberOfSectionsComponment.route, NumberOfSectionsComponment, NumberOfSectionsComponment.title),
  HseRoute.protected(BuildingOutOfScopeComponent.route, BuildingOutOfScopeComponent, BuildingOutOfScopeComponent.title),
  HseRoute.protected(SummaryPageComponent.route, SummaryPageComponent, SummaryPageComponent.title),
  HseRoute.forLoadChildren(BuildingSummaryModule.baseRoute, () => import('./building-summary/building-summary.module').then(m => m.BuildingSummaryModule)),
  HseRoute.forLoadChildren(AccountablePersonModule.baseRoute, () => import('./accountable-person/accountable-person.module').then(m => m.AccountablePersonModule)),
  HseRoute.forLoadChildren(PaymentModule.baseRoute, () => import('./payment/payment.module').then(m => m.PaymentModule)),
  HseRoute.forLoadChildren(KbiModule.baseRoute, () => import('../kbi/kbi.module').then(m => m.KbiModule)),
  HseRoute.forLoadChildren(RegistrationAmendmentsModule.baseRoute, () => import('../registration-amendments/registration-amendments.module').then(m => m.RegistrationAmendmentsModule)),
  HseRoute.forLoadChildren(SafetyCaseReportModule.baseRoute, () => import('./safety-case-report/safety-case-report.module').then(m => m.SafetyCaseReportModule)),
  HseRoute.forLoadChildren(ApplicationCertificateModule.baseRoute, () => import('./application-certificate/application-certificate.module').then(m => m.ApplicationCertificateModule)),
  HseRoute.protected(ApplicationCompletedComponent.route, ApplicationCompletedComponent, ApplicationCompletedComponent.title),
]);

@NgModule({
  declarations: [
    ApplicationTaskListComponent,
    ApplicationCompletedComponent,
    NumberOfSectionsComponment,
    BuildingOutOfScopeComponent,
    SummaryPageComponent,
    SectionSummaryComponent,
    AccountablePersonSummaryComponent,
    IndividualComponent,
    OrganisationComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    ComponentsModule,
    CommonModule,
    PipesModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    HttpClient,
    AccountablePersonNavigation,
    KbiNavigation,
    ...routes.getProviders()
  ]
})
export class ApplicationModule {
  static baseRoute: string = 'application/:id';
}
