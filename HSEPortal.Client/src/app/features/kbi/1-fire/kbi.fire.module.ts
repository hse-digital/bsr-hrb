import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { EvacuationStrategyComponent } from "./evacuation-strategy/evacuation-strategy.component";
import { ProvisionsEquipmentComponent } from "./provisions-equipment/provisions-equipment.component";
import { FireSmokeProvisionsComponent } from "./fire-smoke-provisions/fire-smoke-provisions.component";
import { FireSmokeProvisionLocationsComponent } from "./fire-smoke-provision-locations/fire-smoke-provision-locations.component";
import { LiftsComponent } from "./lifts/lifts.component";
import { FireDoorsCommonComponent } from "./fire-doors-common/fire-doors-common.component";
import { ResidentialUnitFrontDoorsFireResistanceComponent } from "./residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component";

const routes = new HseRoutes([
  HseRoute.protected(EvacuationStrategyComponent.route, EvacuationStrategyComponent, EvacuationStrategyComponent.title),
  HseRoute.protected(ProvisionsEquipmentComponent.route, ProvisionsEquipmentComponent, ProvisionsEquipmentComponent.title),
  HseRoute.protected(FireSmokeProvisionsComponent.route, FireSmokeProvisionsComponent, FireSmokeProvisionsComponent.title),
  HseRoute.protected(FireSmokeProvisionLocationsComponent.route, FireSmokeProvisionLocationsComponent, FireSmokeProvisionLocationsComponent.title),
  HseRoute.protected(LiftsComponent.route, LiftsComponent, LiftsComponent.title),
  HseRoute.protected(ResidentialUnitFrontDoorsFireResistanceComponent.route, ResidentialUnitFrontDoorsFireResistanceComponent, ResidentialUnitFrontDoorsFireResistanceComponent.title),
  HseRoute.protected(FireDoorsCommonComponent.route, FireDoorsCommonComponent, FireDoorsCommonComponent.title),
]);

@NgModule({
  declarations: [
    EvacuationStrategyComponent,
    ProvisionsEquipmentComponent,
    FireSmokeProvisionsComponent,
    FireSmokeProvisionLocationsComponent,
    LiftsComponent,
    FireDoorsCommonComponent,
    ResidentialUnitFrontDoorsFireResistanceComponent
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
export class KbiFireModule {
  static baseRoute: string = 'fire';
}