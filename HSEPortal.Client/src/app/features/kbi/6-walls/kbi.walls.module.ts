import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ExternalWallMaterialsComponent } from "./external-wall-materials/external-wall-materials.component";
import { WallsAcmComponent } from "./walls-acm/walls-acm.component";
import { WallsHplComponent } from "./walls-hpl/walls-hpl.component";
import { EstimatedPercentageComponent } from "./estimated-percentage/estimated-percentage.component";
import { ExternalWallInsulationTypeComponent } from "./external-wall-insulation-type/external-wall-insulation-type.component";
import { ExternalWallInsulationPercentageComponent } from "./external-wall-insulation-percentage/external-wall-insulation-percentage.component";
import { ExternalFeaturesComponent } from "./external-features/external-features.component";
import { FeatureMaterialsOutsideComponent } from "./feature-materials-outside/feature-materials-outside.component";

const routes = new HseRoutes([
  HseRoute.protected(ExternalWallMaterialsComponent.route, ExternalWallMaterialsComponent, ExternalWallMaterialsComponent.title),
  HseRoute.protected(WallsAcmComponent.route, WallsAcmComponent, WallsAcmComponent.title),
  HseRoute.protected(WallsHplComponent.route, WallsHplComponent, WallsHplComponent.title),
  HseRoute.protected(EstimatedPercentageComponent.route, EstimatedPercentageComponent, EstimatedPercentageComponent.title),
  HseRoute.protected(ExternalWallInsulationTypeComponent.route, ExternalWallInsulationTypeComponent, ExternalWallInsulationTypeComponent.title),
  HseRoute.protected(ExternalWallInsulationPercentageComponent.route, ExternalWallInsulationPercentageComponent, ExternalWallInsulationPercentageComponent.title),
  HseRoute.protected(ExternalFeaturesComponent.route, ExternalFeaturesComponent, ExternalFeaturesComponent.title),
  HseRoute.protected(FeatureMaterialsOutsideComponent.route, FeatureMaterialsOutsideComponent, FeatureMaterialsOutsideComponent.title),
]);

@NgModule({
  declarations: [
    ExternalWallMaterialsComponent,
    WallsAcmComponent,
    WallsHplComponent,
    EstimatedPercentageComponent,
    ExternalWallInsulationTypeComponent,
    ExternalWallInsulationPercentageComponent,
    ExternalFeaturesComponent,
    FeatureMaterialsOutsideComponent
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
export class KbiWallsModule {
  static baseRoute: string = 'walls';
}