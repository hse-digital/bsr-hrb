import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ApplicationsSectionsComponent } from "./sections/sections.component";
import { ComplexStructureComponent } from './complex-structure/complex-structure.component';

const routes = new HseRoutes([
  HseRoute.unsafe(ApplicationsSectionsComponent.route, ApplicationsSectionsComponent),
  HseRoute.unsafe(ComplexStructureComponent.route, ComplexStructureComponent)
]);

@NgModule({
    declarations: [
        ApplicationsSectionsComponent,
        ComplexStructureComponent
    ],
    imports: [
        RouterModule.forChild(routes.getRoutes()),
        HseAngularModule,
        CommonModule,
        HttpClientModule
    ],
})
export class ContinueApplicationModule {}
