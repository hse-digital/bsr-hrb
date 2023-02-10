import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { BuildingBlocksIntroComponent } from "./blocks-intro/blocks-intro.component";
import { BuildingFloorsAboveComponent } from "./floors-above/floors-above.component";
import { BuildingHeightComponent } from "./height/height.component";
import { ResidentialUnitsComponent } from "./residential-units/residential-units.component";
import { PeopleLivingInBuildingComponent } from "./people-living-in-building/people-living-in-building.component";
import { NumberBlocksBuildingComponent } from "./number-blocks-building/number-blocks-building.component";
import { AnotherBlockComponent } from "./another-block/another-block.component";
import { CheckAnswersComponent } from "./check-answers/check-answers.component";
import { BlockNameComponent } from "./block-name/block-name.component";
import { HseRoute } from "src/app/services/hse.route";
import { CaptionService } from "src/app/services/caption.service";

const routes: Routes = [
  HseRoute.unsafe('intro', BuildingBlocksIntroComponent),
  HseRoute.unsafe('block-name', BlockNameComponent),
  HseRoute.unsafe('floors-above', BuildingFloorsAboveComponent),
  HseRoute.unsafe('height', BuildingHeightComponent),
  HseRoute.unsafe('residential-units', ResidentialUnitsComponent),
  HseRoute.unsafe('people-living-in-building', PeopleLivingInBuildingComponent),
  HseRoute.unsafe('number-blocks-building', NumberBlocksBuildingComponent),
  HseRoute.unsafe('another-block', AnotherBlockComponent),
  HseRoute.unsafe('check-answers', CheckAnswersComponent),
];

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
    BlockNameComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, CaptionService]
})
export class BuildingModule {

}
