import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { HttpClientModule } from "@angular/common/http";
import { CaptionService } from "../../../../services/caption.service";
import { BuildingBlocksIntroComponent } from "./blocks-intro/blocks-intro.component";
import { BuildingFloorsAboveComponent } from "./floors-above/floors-above.component";
import { BuildingHeightComponent } from "./height/height.component";
import { ResidentialUnitsComponent } from "./residential-units/residential-units.component";
import { PeopleLivingInBuildingComponent } from "./people-living-in-building/people-living-in-building.component";
import { NumberBlocksBuildingComponent } from "./number-blocks-building/number-blocks-building.component";
import { AnotherBlockComponent } from "./another-block/another-block.component";
import { CheckAnswersComponent } from "./check-answers/check-answers.component";
import { BlockNameComponent } from "./block-name/block-name.component";
import { HeightGuardService } from "../../../../services/route-guard/components/building/height-guard.service";
import { FloorsAboveGuardService } from "../../../../services/route-guard/components/building/floors-above-guard.service";

const routes: Routes = [
  { path: 'intro', component: BuildingBlocksIntroComponent },
  { path: 'block-name', component: BlockNameComponent },
  { path: 'floors-above', component: BuildingFloorsAboveComponent, canActivate: [FloorsAboveGuardService] },
  { path: 'height', component: BuildingHeightComponent, canActivate: [HeightGuardService] },
  { path: 'residential-units', component: ResidentialUnitsComponent },
  { path: 'people-living-in-building', component: PeopleLivingInBuildingComponent },
  { path: 'number-blocks-building', component: NumberBlocksBuildingComponent },
  { path: 'another-block', component: AnotherBlockComponent },
  { path: 'check-answers', component: CheckAnswersComponent },
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
  providers: [CaptionService]
})
export class BuildingModule {

}
