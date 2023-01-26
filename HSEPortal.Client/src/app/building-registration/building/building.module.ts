import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { BlocksIntroComponent } from "./blocks-intro/blocks-intro.component";
import { FloorsAboveComponent } from "./floors-above/floors-above.component";

const routes: Routes = [
  { path: 'intro', component: BlocksIntroComponent },
  { path: 'floors-above', component: FloorsAboveComponent },
];

@NgModule({
    declarations: [
      BlocksIntroComponent,
      FloorsAboveComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        HseAngularModule,
        CommonModule
    ]
})
export class BuildingModule {

}
