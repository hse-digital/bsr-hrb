import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationCompletedComponent } from "./components/application-completed/application-completed.component";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ApplicationService } from "src/app/services/application.service";
import { ApplicationTaskListComponent } from "./task-list/task-list.component";
import { ComplexStructureComponent } from "./complex-structure/complex-structure.component";
import { SectionsModule } from "./sections/sections.module";
import { AccountablePersonModule } from "./accountable-person/accountable-person.module";
import { PaymentModule } from "./payment/payment.module";

const routes = new HseRoutes([
  HseRoute.protected(ApplicationTaskListComponent.route, ApplicationTaskListComponent),
  HseRoute.protected(ComplexStructureComponent.route, ComplexStructureComponent),
  HseRoute.forLoadChildren(SectionsModule.baseRoute, () => import('./sections/sections.module').then(m => m.SectionsModule)),
  HseRoute.forLoadChildren(AccountablePersonModule.baseRoute, () => import('./accountable-person/accountable-person.module').then(m => m.AccountablePersonModule)),
  HseRoute.forLoadChildren(PaymentModule.baseRoute, () => import('./payment/payment.module').then(m => m.PaymentModule)),
]);

@NgModule({
  declarations: [
    ApplicationTaskListComponent,
    ApplicationCompletedComponent,
    ComplexStructureComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, ApplicationService, ...routes.getProviders()]
})
export class ApplicationModule {
  static baseRoute: string = 'application/:id';
}
