import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { BuildingStructureTypeComponent } from "./building-structure-type/building-structure-type.component";

const routes = new HseRoutes([
  HseRoute.protected(BuildingStructureTypeComponent.route, BuildingStructureTypeComponent, BuildingStructureTypeComponent.title),
]);

@NgModule({
  declarations: [
    BuildingStructureTypeComponent
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
export class KbiStructureModule {
  static baseRoute: string = 'structure';
}