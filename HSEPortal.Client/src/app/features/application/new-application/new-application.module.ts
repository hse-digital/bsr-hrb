import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ContactEmailGuardService } from "../../../services/route-guard/new-application/contact/contact-email-guard.service";
import { ContactNameGuardService } from "../../../services/route-guard/new-application/contact/contact-name-guard.service";
import { ContactPhoneGuardService } from "../../../services/route-guard/new-application/contact/contact-phone-guard.service";
import { BuildingNameComponent } from "./building-name/building-name.component";
import { ContactEmailComponent } from "./contact-email/contact-email.component";
import { ContactNameComponent } from "./contact-name/contact-name.component";
import { ContactPhoneComponent } from "./contact-phone/contact-phone.component";

const routes: Routes = [
  { path: BuildingNameComponent.route, component: BuildingNameComponent },
  { path: ContactNameComponent.route, component: ContactNameComponent, canActivate: [ContactNameGuardService] },
  { path: ContactEmailComponent.route, component: ContactEmailComponent, canActivate: [ContactEmailGuardService] },
  { path: ContactPhoneComponent.route, component: ContactPhoneComponent, canActivate: [ContactPhoneGuardService] }
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
  providers: [
    ContactNameGuardService,
    ContactEmailGuardService,
    ContactPhoneGuardService,
  ]
})
export class NewApplicationModule {
  static baseRoute: string = 'new';
}
