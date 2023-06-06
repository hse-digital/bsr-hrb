import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { RoofTypeComponent } from "./roof-type/roof-type.component";
import { InsulationLayerComponent } from "./insulation-layer/insulation-layer.component";
import { RoofMaterialComponent } from "./roof-material/roof-material.component";

const routes = new HseRoutes([
  HseRoute.protected(RoofTypeComponent.route, RoofTypeComponent, RoofTypeComponent.title),
  HseRoute.protected(InsulationLayerComponent.route, InsulationLayerComponent, InsulationLayerComponent.title),
  HseRoute.protected(RoofMaterialComponent.route, RoofMaterialComponent, RoofMaterialComponent.title),  
]);

@NgModule({
  declarations: [
    RoofTypeComponent,
    InsulationLayerComponent,
    RoofMaterialComponent
  ],
  providers: [HttpClient, ...routes.getProviders()],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    FormsModule,
    PipesModule,
  ]

})
export class KbiRoofModule {
  static baseRoute: string = 'roof';
}