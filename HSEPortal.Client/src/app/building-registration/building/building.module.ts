import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { BuildingBlocksIntroComponent } from "./blocks-intro/blocks-intro.component";
import { BuildingFloorsAboveComponent } from "./floors-above/floors-above.component";
import { BuildingHeightComponent } from "./height/height.component";
import { PeopleLivingInBuildingComponent } from "./people-living-in-building/people-living-in-building.component";
import { ResidentialUnitsComponent } from "./residential-units/residential-units.component";

const routes: Routes = [
  { path: 'intro', component: BuildingBlocksIntroComponent },
  { path: 'floors-above', component: BuildingFloorsAboveComponent },
  { path: 'height', component: BuildingHeightComponent },
  { path: 'residential-units', component: ResidentialUnitsComponent },
  { path: 'people-living-in-building', component: PeopleLivingInBuildingComponent },
];

@NgModule({
    declarations: [
      BuildingBlocksIntroComponent,
      BuildingFloorsAboveComponent,
      BuildingHeightComponent,
      ResidentialUnitsComponent,
      PeopleLivingInBuildingComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        HseAngularModule,
        CommonModule
    ]
})
export class BuildingModule {

}
