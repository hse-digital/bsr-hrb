import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { HseRoute } from "src/app/services/hse.route";
import { ApplicationsSectionsComponent } from "./sections/sections.component";

const routes: Routes = [
    HseRoute.unsafe(ApplicationsSectionsComponent.route, ApplicationsSectionsComponent)
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