import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { HseRoute } from "src/app/services/hse.route";
import { BuildingNameComponent } from "./building-name/building-name.component";
import { ContactEmailComponent } from "./contact-email/contact-email.component";
import { ContactNameComponent } from "./contact-name/contact-name.component";
import { ContactPhoneComponent } from "./contact-phone/contact-phone.component";

const routes: Routes = [
  HseRoute.unsafe(BuildingNameComponent.route, BuildingNameComponent),
  HseRoute.protected(ContactNameComponent.route, ContactNameComponent),
  HseRoute.protected(ContactEmailComponent.route, ContactEmailComponent),
  HseRoute.protected(ContactPhoneComponent.route, ContactPhoneComponent),
];

@NgModule({
  declarations: [
    BuildingNameComponent,
    ContactEmailComponent,
    ContactNameComponent,
    ContactPhoneComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, ApplicationService, ContactNameComponent, ContactEmailComponent, ContactPhoneComponent]
})
export class NewApplicationModule {
  static baseRoute: string = 'new';
}