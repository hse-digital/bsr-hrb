import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { HseRoute, HseRoutes } from 'src/app/services/hse.route';
import { CheckBeforeStartComponent } from './check-before-start/check-before-start.component';
import { TaskListComponent } from './task-list/task-list.component';
import { EvacuationStrategyComponent } from './evacuation-strategy/evacuation-strategy.component';
import { ProvisionsEquipmentComponent } from './provisions-equipment/provisions-equipment.component';
import { FireSmokeProvisionsComponent } from './fire-smoke-provisions/fire-smoke-provisions.component';
import { FireSmokeProvisionLocationsComponent } from './fire-smoke-provision-locations/fire-smoke-provision-locations.component';
import { LiftsComponent } from './lifts/lifts.component';
import { FireDoorsCommonComponent } from './fire-doors-common/fire-doors-common.component';
import { ResidentialUnitFrontDoorsFireResistanceComponent } from './residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component';
import { RoofTypeComponent } from './roof-type/roof-type.component';
import { InsulationLayerComponent } from './insulation-layer/insulation-layer.component';
import { RoofMaterialComponent } from './roof-material/roof-material.component';
import { EnergySupplyComponent } from './energy-supply/energy-supply.component';

const routes = new HseRoutes([
  HseRoute.protected(CheckBeforeStartComponent.route, CheckBeforeStartComponent, CheckBeforeStartComponent.title),
  HseRoute.protected(TaskListComponent.route, TaskListComponent, TaskListComponent.title),
  HseRoute.protected(EvacuationStrategyComponent.route, EvacuationStrategyComponent, EvacuationStrategyComponent.title),
  HseRoute.protected(ProvisionsEquipmentComponent.route, ProvisionsEquipmentComponent, ProvisionsEquipmentComponent.title),
  HseRoute.protected(FireSmokeProvisionsComponent.route, FireSmokeProvisionsComponent, FireSmokeProvisionsComponent.title),
  HseRoute.protected(FireSmokeProvisionLocationsComponent.route, FireSmokeProvisionLocationsComponent, FireSmokeProvisionLocationsComponent.title),
  HseRoute.protected(LiftsComponent.route, LiftsComponent, LiftsComponent.title),
  HseRoute.protected(FireDoorsCommonComponent.route, FireDoorsCommonComponent, FireDoorsCommonComponent.title),
  HseRoute.protected(ResidentialUnitFrontDoorsFireResistanceComponent.route, ResidentialUnitFrontDoorsFireResistanceComponent, ResidentialUnitFrontDoorsFireResistanceComponent.title),
  HseRoute.protected(RoofTypeComponent.route, RoofTypeComponent, RoofTypeComponent.title),
  HseRoute.protected(InsulationLayerComponent.route, InsulationLayerComponent, InsulationLayerComponent.title),
  HseRoute.protected(RoofMaterialComponent.route, RoofMaterialComponent, RoofMaterialComponent.title),
  HseRoute.protected(EnergySupplyComponent.route, EnergySupplyComponent, EnergySupplyComponent.title)
]);

@NgModule({
  declarations: [
    CheckBeforeStartComponent,
    TaskListComponent,
    EvacuationStrategyComponent,
    ProvisionsEquipmentComponent,
    FireSmokeProvisionsComponent,
    FireSmokeProvisionLocationsComponent,
    LiftsComponent,
    FireDoorsCommonComponent,
    ResidentialUnitFrontDoorsFireResistanceComponent,
    RoofTypeComponent,
    InsulationLayerComponent,
    RoofMaterialComponent,
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
export class KbiModule {
  static baseRoute: string = "kbi";
}
