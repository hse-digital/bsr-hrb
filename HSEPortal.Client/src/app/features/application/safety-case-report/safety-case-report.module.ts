import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { SafetyCaseReportDateComponent } from './safety-case-report-date/safety-case-report-date.component';


const routes = new HseRoutes([
  HseRoute.protected(SafetyCaseReportDateComponent.route, SafetyCaseReportDateComponent, SafetyCaseReportDateComponent.title),

]);

@NgModule({
  declarations: [
    SafetyCaseReportDateComponent,
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, ...routes.getProviders()]
})
export class SafetyCaseReportModule {
  static baseRoute: string = 'safety-case-report';
}
