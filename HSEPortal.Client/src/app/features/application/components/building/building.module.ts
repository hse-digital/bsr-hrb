import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { BuildingBlocksIntroComponent } from "src/app/features/application/blocks/blocks-intro/blocks-intro.component";
import { BuildingFloorsAboveComponent } from "src/app/features/application/blocks/floors-above/floors-above.component";
import { BuildingHeightComponent } from "src/app/features/application/blocks/height/height.component";
import { ResidentialUnitsComponent } from "src/app/features/application/blocks/residential-units/residential-units.component";
import { PeopleLivingInBuildingComponent } from "src/app/features/application/blocks/people-living-in-building/people-living-in-building.component";
import { NumberBlocksBuildingComponent } from "./number-blocks-building/number-blocks-building.component";
import { AnotherBlockComponent } from "src/app/features/application/blocks/another-block/another-block.component";
import { CheckAnswersComponent } from "src/app/features/application/blocks/check-answers/check-answers.component";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { CaptionService } from "src/app/services/caption.service";
import { NameComponent } from "src/app/features/application/blocks/name/name.component";

const routes = new HseRoutes([
  HseRoute.unsafe(BuildingBlocksIntroComponent.route, BuildingBlocksIntroComponent),
  HseRoute.protected(NameComponent.route, NameComponent),
  HseRoute.protected(BuildingFloorsAboveComponent.route, BuildingFloorsAboveComponent),
  HseRoute.protected(BuildingHeightComponent.route, BuildingHeightComponent),
  HseRoute.protected(ResidentialUnitsComponent.route, ResidentialUnitsComponent),
  HseRoute.protected(PeopleLivingInBuildingComponent.route, PeopleLivingInBuildingComponent),
  HseRoute.protected(NumberBlocksBuildingComponent.route, NumberBlocksBuildingComponent),
  HseRoute.protected(AnotherBlockComponent.route, AnotherBlockComponent),
  HseRoute.protected(CheckAnswersComponent.route, CheckAnswersComponent),
]);

@NgModule({
  declarations: [
    BuildingBlocksIntroComponent,
    BuildingFloorsAboveComponent,
    BuildingHeightComponent,
    ResidentialUnitsComponent,
    PeopleLivingInBuildingComponent,
    NumberBlocksBuildingComponent,
    AnotherBlockComponent,
    CheckAnswersComponent,
    NameComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, CaptionService, ...routes.getProviders()]
})
export class BuildingModule {
  static baseRoute: string = ":id/blocks/:blockId"
}
