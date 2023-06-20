import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { EnergyTypeComponent } from "./energy-type/energy-type.component";
import { OnSiteEnergyGenerationComponent } from "./on-site-energy-generation/on-site-energy-generation.component";
import { EnergySupplyComponent } from "./energy-supply/energy-supply.component";

const routes = new HseRoutes([
  HseRoute.protected(EnergyTypeComponent.route, EnergyTypeComponent, EnergyTypeComponent.title),
  HseRoute.protected(OnSiteEnergyGenerationComponent.route, OnSiteEnergyGenerationComponent, OnSiteEnergyGenerationComponent.title),
  HseRoute.protected(EnergySupplyComponent.route, EnergySupplyComponent, EnergySupplyComponent.title),
]);

@NgModule({
  declarations: [
    EnergyTypeComponent,
    OnSiteEnergyGenerationComponent,
    EnergySupplyComponent
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
export class KbiEnergyModule {
  static baseRoute: string = 'energy';
}