import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ContactDetailsEmailComponent } from "./contact-details-email/contact-details-email.component";
import { ContactDetailsNameComponent } from "./contact-details-name/contact-details-name.component";
import { ContactDetailsPhoneComponent } from "./contact-details-phone/contact-details-phone.component";

const routes: Routes = [
  { path: 'name', component: ContactDetailsNameComponent },
  { path: 'phone', component: ContactDetailsPhoneComponent },
  { path: 'email', component: ContactDetailsEmailComponent }
];

@NgModule({
  declarations: [
    ContactDetailsNameComponent,
    ContactDetailsPhoneComponent,
    ContactDetailsEmailComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ]
})
export class ContactDetailsModule {

}
