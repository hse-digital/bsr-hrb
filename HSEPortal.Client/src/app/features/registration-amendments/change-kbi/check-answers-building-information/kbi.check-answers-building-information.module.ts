import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ChangeChangesSinceCompletionAnswers } from "./changes-since-completion-answers.component";
import { ChangeBuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { ChangeEnergySupplyAndStorageAnswersComponent } from "./energy-supply-and-storage-answers.component";
import { ChangeExternalFeaturesAnswersComponent } from "./external-features-answers.component";
import { ChangeExternalWallsAnswersComponent } from "./external-walls-features-answers.component";
import { ChangeFireAndSmokeControlsAnswersComponent } from "./fire-and-smoke-controls-answers.component";
import { ChangeRoofAnswersComponent } from "./roof-answers.component";
import { ChangeStaircasesAnswersComponent } from "./staircase-answers.component.component";
import { ChangeStructuralTypeAndMaterialsAnswersComponent } from "./structural-type-and-materials-answers.component";
import { ChangeUsesBelowGroundLevelAnswersComponent } from "./uses-below-ground-level-answers.component";
import { ChangeUsesGroundLevelAndAboveAnswersComponent } from "./uses-ground-level-and-above-answers.component";

const routes = new HseRoutes([
  HseRoute.protected(ChangeBuildingInformationCheckAnswersComponent.route, ChangeBuildingInformationCheckAnswersComponent, ChangeBuildingInformationCheckAnswersComponent.title),
]);

@NgModule({
  declarations: [
    ChangeBuildingInformationCheckAnswersComponent,
    ChangeFireAndSmokeControlsAnswersComponent,
    ChangeEnergySupplyAndStorageAnswersComponent,
    ChangeStructuralTypeAndMaterialsAnswersComponent,
    ChangeRoofAnswersComponent,
    ChangeStaircasesAnswersComponent,
    ChangeExternalWallsAnswersComponent,
    ChangeExternalFeaturesAnswersComponent,
    ChangeUsesGroundLevelAndAboveAnswersComponent,
    ChangeUsesBelowGroundLevelAnswersComponent,
    ChangeChangesSinceCompletionAnswers,
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
export class KbiChangeCheckAnswersModule {
  static baseRoute: string = 'change-kbi';
}
