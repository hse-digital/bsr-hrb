import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { PrimaryUseOfBuildingComponent } from "./primary-use-of-building/primary-use-of-building.component";
import { SecondaryUseBuildingComponent } from "./secondary-use-building/secondary-use-building.component";
import { FloorsBelowGroundLevelComponent } from "./floors-below-ground-level/floors-below-ground-level.component";
import { PrimaryUseBuildingBelowGroundLevelComponent } from "./primary-use-building-below-ground-level/primary-use-building-below-ground-level.component";
import { ChangePrimaryUseComponent } from "./change-primary-use/change-primary-use.component";
import { UndergoneBuildingMaterialChangesComponent } from "./undergone-building-material-changes/undergone-building-material-changes.component";
import { MostRecentChangeComponent } from "./most-recent-material-change/most-recent-material-change.component";
import { AddedFloorsTypeComponent } from "./added-floors-type/added-floors-type.component";
import { YearMostRecentChangeComponent } from "./year-most-recent-change/year-most-recent-change.component";
import { CertificatesYearChangeComponent } from "./certificates-year-change/certificates-year-change.component";
import { PreviousUseBuildingComponent } from "./previous-use-building/previous-use-building.component";

const routes = new HseRoutes([
  HseRoute.protected(PrimaryUseOfBuildingComponent.route, PrimaryUseOfBuildingComponent, PrimaryUseOfBuildingComponent.title),
  HseRoute.protected(SecondaryUseBuildingComponent.route, SecondaryUseBuildingComponent, SecondaryUseBuildingComponent.title),
  HseRoute.protected(FloorsBelowGroundLevelComponent.route, FloorsBelowGroundLevelComponent, FloorsBelowGroundLevelComponent.title),
  HseRoute.protected(PrimaryUseBuildingBelowGroundLevelComponent.route, PrimaryUseBuildingBelowGroundLevelComponent, PrimaryUseBuildingBelowGroundLevelComponent.title),
  HseRoute.protected(ChangePrimaryUseComponent.route, ChangePrimaryUseComponent, ChangePrimaryUseComponent.title),
  HseRoute.protected(CertificatesYearChangeComponent.route, CertificatesYearChangeComponent, CertificatesYearChangeComponent.title),
  HseRoute.protected(PreviousUseBuildingComponent.route, PreviousUseBuildingComponent, PreviousUseBuildingComponent.title),
  HseRoute.protected(UndergoneBuildingMaterialChangesComponent.route, UndergoneBuildingMaterialChangesComponent, UndergoneBuildingMaterialChangesComponent.title),
  HseRoute.protected(MostRecentChangeComponent.route, MostRecentChangeComponent, MostRecentChangeComponent.title),
  HseRoute.protected(AddedFloorsTypeComponent.route, AddedFloorsTypeComponent, AddedFloorsTypeComponent.title),
  HseRoute.protected(YearMostRecentChangeComponent.route, YearMostRecentChangeComponent, YearMostRecentChangeComponent.title),
]);

@NgModule({
  declarations: [
    PrimaryUseOfBuildingComponent,
    SecondaryUseBuildingComponent,
    FloorsBelowGroundLevelComponent,
    PrimaryUseBuildingBelowGroundLevelComponent,
    ChangePrimaryUseComponent,
    CertificatesYearChangeComponent,
    PreviousUseBuildingComponent,
    UndergoneBuildingMaterialChangesComponent,
    MostRecentChangeComponent,
    AddedFloorsTypeComponent,
    YearMostRecentChangeComponent
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
export class KbiBuildingUseModule {
  static baseRoute: string = 'building';
}