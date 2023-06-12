import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ChangesSinceCompletionAnswers } from "./changes-since-completion-answers.component";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { EnergySupplyAndStorageAnswersComponent } from "./energy-supply-and-storage-answers.component";
import { ExternalFeaturesAnswersComponent } from "./external-features-answers.component";
import { ExternalWallsAnswersComponent } from "./external-walls-features-answers-answers.component";
import { FireAndSmokeControlsAnswersComponent } from "./fire-and-smoke-controls-answers.component";
import { RoofAnswersComponent } from "./roof-answers.component";
import { StaircasesAnswersComponent } from "./staircase-answers.component.component";
import { StructuralTypeAndMaterialsAnswersComponent } from "./structural-type-and-materials-answers.component";
import { UsesBelowGroundLevelAnswersComponent } from "./uses-below-ground-level-answers.component";
import { UsesGroundLevelAndAboveAnswersComponent } from "./uses-ground-level-and-above-answers.component";

const routes = new HseRoutes([
  HseRoute.protected(BuildingInformationCheckAnswersComponent.route, BuildingInformationCheckAnswersComponent, BuildingInformationCheckAnswersComponent.title),
]);

@NgModule({
  declarations: [
    BuildingInformationCheckAnswersComponent,
    FireAndSmokeControlsAnswersComponent,
    EnergySupplyAndStorageAnswersComponent,
    StructuralTypeAndMaterialsAnswersComponent,
    RoofAnswersComponent,
    StaircasesAnswersComponent,
    ExternalWallsAnswersComponent,
    ExternalFeaturesAnswersComponent,
    UsesGroundLevelAndAboveAnswersComponent,
    UsesBelowGroundLevelAnswersComponent,
    ChangesSinceCompletionAnswers,
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
export class KbiCheckAnswersModule {
  static baseRoute: string = 'check-answers';
}
