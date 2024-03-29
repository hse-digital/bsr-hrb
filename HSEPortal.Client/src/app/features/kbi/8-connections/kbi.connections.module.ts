import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { StructureConnectionsComponent } from './structure-connections/structure-connections.component';
import { OtherHighRiseBuildingConnectionsComponent } from './other-high-rise-building-connections/other-high-rise-building-connections.component';
import { HowOtherHighRiseBuildingsConnectedComponent } from './how-other-high-rise-buildings-connected/how-other-high-rise-buildings-connected.component';
import { OtherBuildingConnectionsComponent } from './other-building-connections/other-building-connections.component';
import { HowOtherBuildingsConnectedComponent } from './how-other-buildings-connected/how-other-buildings-connected.component';
import { ConnectionsCheckAnswerComponent } from './connections-check-answer/connections-check-answer.component';

const routes = new HseRoutes([
  HseRoute.protected(StructureConnectionsComponent.route, StructureConnectionsComponent, StructureConnectionsComponent.title),
  HseRoute.protected(OtherHighRiseBuildingConnectionsComponent.route, OtherHighRiseBuildingConnectionsComponent, OtherHighRiseBuildingConnectionsComponent.title),
  HseRoute.protected(HowOtherHighRiseBuildingsConnectedComponent.route, HowOtherHighRiseBuildingsConnectedComponent, HowOtherHighRiseBuildingsConnectedComponent.title),
  HseRoute.protected(OtherBuildingConnectionsComponent.route, OtherBuildingConnectionsComponent, OtherBuildingConnectionsComponent.title),
  HseRoute.protected(HowOtherBuildingsConnectedComponent.route, HowOtherBuildingsConnectedComponent, HowOtherBuildingsConnectedComponent.title),
  HseRoute.protected(ConnectionsCheckAnswerComponent.route, ConnectionsCheckAnswerComponent, ConnectionsCheckAnswerComponent.title),
]);

@NgModule({
  declarations: [
    StructureConnectionsComponent,
    OtherHighRiseBuildingConnectionsComponent,
    HowOtherHighRiseBuildingsConnectedComponent,
    OtherBuildingConnectionsComponent,
    HowOtherBuildingsConnectedComponent,
    ConnectionsCheckAnswerComponent
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
export class KbiConnectionsModule {
  static baseRoute: string = 'connections';
}