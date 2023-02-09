import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { BuildingNameComponent } from "./building-name/building-name.component";
import { ContactEmailComponent } from "./contact-email/contact-email.component";
import { ContactNameComponent } from "./contact-name/contact-name.component";
import { ContactPhoneComponent } from "./contact-phone/contact-phone.component";

const routes: Routes = [
    { path: BuildingNameComponent.route, component: BuildingNameComponent },
    { path: ContactNameComponent.route, component: ContactNameComponent },
    { path: ContactEmailComponent.route, component: ContactEmailComponent },
    { path: ContactPhoneComponent.route, component: ContactPhoneComponent }
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
})
export class NewApplicationModule {
    static baseRoute: string = 'new';
 }