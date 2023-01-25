import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { RegistrationComponent } from "./registration/registration.component";

const routes: Routes = [
    { path: '', component: RegistrationComponent },
  ];

@NgModule({
    declarations: [
        RegistrationComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        HseAngularModule
    ]
})
export class BuildingRegistrationModule {

}