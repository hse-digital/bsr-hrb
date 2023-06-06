import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { TotalStaircasesComponent } from "./total-staircases/total-staircases.component";

const routes = new HseRoutes([
  HseRoute.protected(TotalStaircasesComponent.route, TotalStaircasesComponent, TotalStaircasesComponent.title),
]);

@NgModule({
  declarations: [
    TotalStaircasesComponent
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
export class KbiStaircasesModule {
  static baseRoute: string = 'staircases';
}