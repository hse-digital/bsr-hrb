import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { BuildingNameComponent } from "./building-name/building-name.component";
import { ContactEmailValidationComponent } from "./contact-email/contact-email-validation.component";
import { ContactEmailComponent } from "./contact-email/contact-email.component";
import { ContactNameComponent } from "./contact-name/contact-name.component";
import { ContactPhoneComponent } from "./contact-phone/contact-phone.component";

const routes = new HseRoutes([
  HseRoute.unsafe(BuildingNameComponent.route, BuildingNameComponent),
  HseRoute.protected(ContactNameComponent.route, ContactNameComponent),
  HseRoute.protected(ContactPhoneComponent.route, ContactPhoneComponent),
  HseRoute.protected(ContactEmailComponent.route, ContactEmailComponent),
  HseRoute.protected(ContactEmailValidationComponent.route, ContactEmailValidationComponent),
]);

@NgModule({
  declarations: [
    BuildingNameComponent,
    ContactEmailComponent,
    ContactNameComponent,
    ContactPhoneComponent,
    ContactEmailValidationComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, ApplicationService, ...routes.getProviders()]
})
export class NewApplicationModule {
  static baseRoute: string = 'new-application';
}
