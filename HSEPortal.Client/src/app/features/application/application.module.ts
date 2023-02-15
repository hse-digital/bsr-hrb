import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationStartComponent } from "./components/application-start/application-start.component";
import { ApplicationContinueComponent } from "./components/application-continue/application-continue.component";
import { SecurityCodeComponent } from "./components/security-code/security-code.component";
import { NewApplicationModule } from "./new-application/new-application.module";
import { ApplicationCompletedComponent } from "./components/application-completed/application-completed.component";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ApplicationService } from "src/app/services/application.service";
import { BuildingModule } from "./components/building/building.module";
import { AccountablePersonModule } from "./accountable-person/accountable-person.module";
import { ContinueApplicationEnterDataComponent } from "./components/application-continue/enterdata.component";
import { ContinueApplicationVerifyComponent } from "./components/application-continue/verify.component";
import { ContinueApplicationResendCodeComponent } from "./components/application-continue/resend.component";

const routes = new HseRoutes([
  HseRoute.unsafe(ApplicationStartComponent.route, ApplicationStartComponent),
  HseRoute.unsafe(ApplicationContinueComponent.route, ApplicationContinueComponent),
  HseRoute.unsafe(SecurityCodeComponent.route, SecurityCodeComponent),
  HseRoute.forChildren(AccountablePersonModule.baseRoute, () => import('./accountable-person/accountable-person.module').then(m => m.AccountablePersonModule)),
  HseRoute.forChildren(NewApplicationModule.baseRoute, () => import('./new-application/new-application.module').then(m => m.NewApplicationModule)),
  HseRoute.forChildren(':id', () => import('./continue-application/continue-application.module').then(m => m.ContinueApplicationModule)),
  HseRoute.forChildren(BuildingModule.baseRoute, () => import('./components/building/building.module').then(m => m.BuildingModule)),
]);

@NgModule({
  declarations: [
    ApplicationStartComponent,
    ApplicationContinueComponent,
    ContinueApplicationEnterDataComponent, 
    ContinueApplicationVerifyComponent,
    ContinueApplicationResendCodeComponent,
    SecurityCodeComponent,
    ApplicationCompletedComponent,
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, ApplicationService]
})
export class ApplicationModule {
  static baseRoute: string = 'application';
}
