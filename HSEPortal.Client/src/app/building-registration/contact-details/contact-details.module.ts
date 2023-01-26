import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ContactDetailsNameComponent } from "./contact-details-name/contact-details-name.component";

const routes: Routes = [
    {
        path: 'name', component: ContactDetailsNameComponent
    },
];

@NgModule({
    declarations: [
        ContactDetailsNameComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        HseAngularModule,
        CommonModule
    ]
})
export class ContactDetailsModule {

}