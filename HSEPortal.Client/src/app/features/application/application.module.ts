import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationCompletedComponent } from "./components/application-completed/application-completed.component";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ApplicationService } from "src/app/services/application.service";
import { ApplicationTaskListComponent } from "./task-list/task-list.component";
import { SectionsModule } from "./sections/sections.module";
import { AccountablePersonModule } from "./accountable-person/accountable-person.module";
import { NumberOfSectionsComponment } from "./number-of-sections/number-of-sections.component";
import { BuildingOutOfScopeComponent } from "./out-of-scope/out-of-scope.component";
import { ContinueAnywayComponent } from "./out-of-scope/continue-anyway.component";
import { PaymentModule } from "./payment/payment.module";
import { ComponentsModule } from "src/app/components/components.module";

const routes = new HseRoutes([
  HseRoute.protected(ApplicationTaskListComponent.route, ApplicationTaskListComponent),
  HseRoute.protected(NumberOfSectionsComponment.route, NumberOfSectionsComponment),
  HseRoute.unsafe(BuildingOutOfScopeComponent.route, BuildingOutOfScopeComponent),
  HseRoute.unsafe(ContinueAnywayComponent.route, ContinueAnywayComponent),
  HseRoute.forLoadChildren(SectionsModule.baseRoute, () => import('./sections/sections.module').then(m => m.SectionsModule)),
  HseRoute.forLoadChildren(AccountablePersonModule.baseRoute, () => import('./accountable-person/accountable-person.module').then(m => m.AccountablePersonModule)),
  HseRoute.forLoadChildren(PaymentModule.baseRoute, () => import('./payment/payment.module').then(m => m.PaymentModule)),
]);

@NgModule({
  declarations: [
    ApplicationTaskListComponent,
    ApplicationCompletedComponent,
    NumberOfSectionsComponment,
    BuildingOutOfScopeComponent,
    ContinueAnywayComponent,
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    ComponentsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, ApplicationService, ...routes.getProviders()]
})
export class ApplicationModule {
  static baseRoute: string = 'application/:id';
}
