import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { PipesModule } from "src/app/pipes/pipes.module";
import { CaptionService } from "src/app/services/caption.service";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { AddMoreSectionsComponent } from "./add-more-sections/add-more-sections.component";
import { ConfirmAddressComponent } from "./address/confirm-address.component";
import { FindAddressComponent } from "./address/find-address.component";
import { ManualAddressComponent } from "./address/manual-address.component";
import { NotFoundAddressComponent } from "./address/not-found-address.component";
import { SectionAddressComponent } from "./address/section-address.component";
import { SelectAddressComponent } from "./address/select-address.component";
import { TooManyAddressComponent } from "./address/too-many-address.component";
import { SectionCheckAnswersComponent } from "./check-answers/check-answers.component";
import { SectionFloorsAboveComponent } from "./floors-above/floors-above.component";
import { SectionHeightComponent } from "./height/height.component";
import { SectionsIntroComponent } from "./intro/intro.component";
import { MoreInformationComponent } from "./more-information/more-information.component";
import { NameAllBlocksComponent } from "./name-all-blocks/name-all-blocks.component";
import { SectionNameComponent } from "./name/name.component";
import { SectionPeopleLivingInBuildingComponent } from "./people-living-in-building/people-living-in-building.component";
import { SectionResidentialUnitsComponent } from "./residential-units/residential-units.component";


const routes = new HseRoutes([
  HseRoute.unsafe(AddMoreSectionsComponent.route, AddMoreSectionsComponent),
  HseRoute.unsafe(MoreInformationComponent.route, MoreInformationComponent),
  HseRoute.unsafe(NameAllBlocksComponent.route, NameAllBlocksComponent),
  HseRoute.forChildren(':id', new HseRoutes([
    HseRoute.unsafe(SectionsIntroComponent.route, SectionsIntroComponent),
    HseRoute.unsafe(SectionFloorsAboveComponent.route, SectionFloorsAboveComponent),
    HseRoute.unsafe(SectionNameComponent.route, SectionNameComponent),
    HseRoute.unsafe(SectionHeightComponent.route, SectionHeightComponent),
    HseRoute.unsafe(SectionResidentialUnitsComponent.route, SectionResidentialUnitsComponent),
    HseRoute.unsafe(SectionPeopleLivingInBuildingComponent.route, SectionPeopleLivingInBuildingComponent),
    HseRoute.unsafe(SectionAddressComponent.route, SectionAddressComponent),
    HseRoute.unsafe(SectionCheckAnswersComponent.route, SectionCheckAnswersComponent),
  ])),
]);

@NgModule({
  declarations: [
    SectionsIntroComponent,
    SectionFloorsAboveComponent,
    SectionNameComponent,
    SectionHeightComponent,
    SectionResidentialUnitsComponent,
    SectionPeopleLivingInBuildingComponent,
    SectionCheckAnswersComponent,
    AddMoreSectionsComponent,
    SectionAddressComponent,
    MoreInformationComponent,
    NameAllBlocksComponent,
    ConfirmAddressComponent,
    NotFoundAddressComponent,
    TooManyAddressComponent,
    FindAddressComponent,
    SelectAddressComponent,
    ManualAddressComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    PipesModule
  ],
  providers: [
    CaptionService,
    ...routes.getProviders()
  ]
})
export class SectionsModule {
  public static baseRoute: string = "sections";
}
