import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { RegistrationStatusComponent } from "./registration-status/registration-status.component";
import { NewOrExistingRegistrationComponent } from './new-or-existing-registration/new-or-existing-registration.component';
import { CommonModule } from "@angular/common";
import { BuildingRegistrationComponent } from "./building-registration.component";

const routes: Routes = [
    {
        path: '', component: BuildingRegistrationComponent, children: [
            { path: '', component: NewOrExistingRegistrationComponent },
            { path: 'status', component: RegistrationStatusComponent },
        ]
    },
];

@NgModule({
    declarations: [
        BuildingRegistrationComponent,
        RegistrationStatusComponent,
        NewOrExistingRegistrationComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
        HseAngularModule
    ],
    exports: [
        RouterModule
    ]
})
export class BuildingRegistrationModule {

}