import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationCompletedComponent } from "./components/application-completed/application-completed.component";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ApplicationService } from "src/app/services/application.service";
import { BuildingModule } from "./components/building/building.module";
import { AccountablePersonModule } from "./accountable-person/accountable-person.module";
import { ApplicationTaskListComponent } from "./task-list/task-list.component";

const routes = new HseRoutes([
  HseRoute.protected(ApplicationTaskListComponent.route, ApplicationTaskListComponent),
  HseRoute.forChildren(AccountablePersonModule.baseRoute, () => import('./accountable-person/accountable-person.module').then(m => m.AccountablePersonModule)),
  HseRoute.forChildren(BuildingModule.baseRoute, () => import('./components/building/building.module').then(m => m.BuildingModule)),
]);

@NgModule({
  declarations: [
    ApplicationTaskListComponent,
    ApplicationCompletedComponent,
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