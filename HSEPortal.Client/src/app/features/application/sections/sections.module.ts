import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { AddressModule } from "src/app/components/address.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { CaptionService } from "src/app/services/caption.service";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { AddMoreSectionsComponent } from "./add-more-sections/add-more-sections.component";
import { SectionAddressComponent } from "./address/address.component";
import { SectionCheckAnswersComponent } from "./check-answers/check-answers.component";
import { SectionFloorsAboveComponent } from "./floors-above/floors-above.component";
import { SectionHeightComponent } from "./height/height.component";
import { SectionsIntroComponent } from "./intro/intro.component";
import { MoreInformationComponent } from "./more-information/more-information.component";
import { NameAllBlocksComponent } from "./name-all-blocks/name-all-blocks.component";
import { SectionNameComponent } from "./name/name.component";
import { SectionOtherAddressesComponent } from "./other-addresses/other-addresses.component";
import { SectionPeopleLivingInBuildingComponent } from "./people-living-in-building/people-living-in-building.component";
import { SectionResidentialUnitsComponent } from "./residential-units/residential-units.component";
import { SectionsComponent } from "./sections.component";
import { SectionYearOfCompletionComponent } from "./year-of-completion/year-of-completion.component";
import { SectionYearRangeComponent } from "./year-range/year-range.component";

const routes = new HseRoutes([
    HseRoute.unsafe(AddMoreSectionsComponent.route, AddMoreSectionsComponent),
    HseRoute.unsafe(MoreInformationComponent.route, MoreInformationComponent),
    HseRoute.unsafe(NameAllBlocksComponent.route, NameAllBlocksComponent),
    HseRoute.unsafe(SectionCheckAnswersComponent.route, SectionCheckAnswersComponent),
    HseRoute.forChildren(':id', SectionsComponent, new HseRoutes([
        HseRoute.unsafe(SectionsIntroComponent.route, SectionsIntroComponent),
        HseRoute.unsafe(SectionFloorsAboveComponent.route, SectionFloorsAboveComponent),
        HseRoute.unsafe(SectionNameComponent.route, SectionNameComponent),
        HseRoute.unsafe(SectionHeightComponent.route, SectionHeightComponent),
        HseRoute.unsafe(SectionResidentialUnitsComponent.route, SectionResidentialUnitsComponent),
        HseRoute.unsafe(SectionYearOfCompletionComponent.route, SectionYearOfCompletionComponent),
        HseRoute.unsafe(SectionYearRangeComponent.route, SectionYearRangeComponent),
        HseRoute.unsafe(SectionAddressComponent.route, SectionAddressComponent),
        HseRoute.unsafe(SectionOtherAddressesComponent.route, SectionOtherAddressesComponent),
        HseRoute.unsafe(SectionPeopleLivingInBuildingComponent.route, SectionPeopleLivingInBuildingComponent),
    ])),
]);

@NgModule({
    declarations: [
        SectionsComponent,
        SectionsIntroComponent,
        SectionFloorsAboveComponent,
        SectionNameComponent,
        SectionHeightComponent,
        SectionResidentialUnitsComponent,
        SectionPeopleLivingInBuildingComponent,
        SectionCheckAnswersComponent,
        AddMoreSectionsComponent,
        MoreInformationComponent,
        SectionYearOfCompletionComponent,
        SectionYearRangeComponent,
        SectionAddressComponent,
        SectionOtherAddressesComponent,
        NameAllBlocksComponent
    ],
    imports: [
        RouterModule.forChild(routes.getRoutes()),
        HseAngularModule,
        CommonModule,
        HttpClientModule,
        PipesModule,
        AddressModule
    ],
    providers: [
        CaptionService,
        ...routes.getProviders()
    ]
})
export class SectionsModule {
    public static baseRoute: string = "sections";
}