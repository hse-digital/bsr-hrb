import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoofMaterialComponent } from './roof-material/roof-material.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HseRoute, HseRoutes } from 'src/app/services/hse.route';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { RoofInsulationComponent } from './roof-insulation/roof-insulation.component';

const routes = new HseRoutes([
  HseRoute.protected(RoofMaterialComponent.route, RoofMaterialComponent, RoofMaterialComponent.title),
  HseRoute.protected(RoofInsulationComponent.route, RoofInsulationComponent, RoofInsulationComponent.title),
]);

@NgModule({
  declarations: [
    RoofMaterialComponent,
    RoofInsulationComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule
  ],
  providers: [HttpClient, ...routes.getProviders()],
})
export class KbiModule {
  public static baseRoute: string = "kbi";
}
