import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationsSectionsComponent } from "./sections/sections.component";

const routes: Routes = [
    { path: ApplicationsSectionsComponent.route, component: ApplicationsSectionsComponent },
];

@NgModule({
    declarations: [
        ApplicationsSectionsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        HseAngularModule,
        CommonModule,
        HttpClientModule
    ],
})
export class ContinueApplicationModule {}