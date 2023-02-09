import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationStartComponent } from "./components/application-start/application-start.component";
import { ApplicationContinueComponent } from "./components/application-continue/application-continue.component";
import { SecurityCodeComponent } from "./components/security-code/security-code.component";
import { BuildingRegistrationService } from "src/app/services/building-registration.service";
import { NewApplicationModule } from "./new-application/new-application.module";
import { ApplicationCompletedComponent } from "./components/application-completed/application-completed.component";
import { BuildingGuardService } from "../../services/route-guard/components/building/building-guard.service";

const routes: Routes = [
  { path: ApplicationStartComponent.route, component: ApplicationStartComponent },
  { path: ApplicationContinueComponent.route, component: ApplicationContinueComponent },
  { path: SecurityCodeComponent.route, component: SecurityCodeComponent },
  { path: NewApplicationModule.baseRoute, loadChildren: () => import('./new-application/new-application.module').then(m => m.NewApplicationModule), canActivateChild: [BuildingGuardService] },
  { path: ':id', loadChildren: () => import('./continue-application/continue-application.module').then(m => m.ContinueApplicationModule) },
];

@NgModule({
  declarations: [
    ApplicationStartComponent,
    ApplicationContinueComponent,
    SecurityCodeComponent,
    ApplicationCompletedComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [BuildingRegistrationService]
})
export class ApplicationModule {
  static baseRoute: string = 'application';
}
