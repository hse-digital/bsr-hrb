import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { AddMoreSectionsComponent } from "./add-more-sections/add-more-sections.component";
import { SectionAddressComponent } from "./address/address.component";
import { CertificateIssuerComponent } from "./certificate-issuer/certificate-issuer.component";
import { CertificateNumberComponent } from "./certificate-number/certificate-number.component";
import { SectionCheckAnswersComponent } from "./check-answers/check-answers.component";
import { SectionAnswersComponent } from "./check-answers/section-answers.component";
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
    HseRoute.protected(AddMoreSectionsComponent.route, AddMoreSectionsComponent, undefined),
    HseRoute.protected(MoreInformationComponent.route, MoreInformationComponent, undefined, MoreInformationComponent.title),
    HseRoute.protected(NameAllBlocksComponent.route, NameAllBlocksComponent, undefined, NameAllBlocksComponent.title),
    HseRoute.protected(SectionCheckAnswersComponent.route, SectionCheckAnswersComponent, undefined, SectionCheckAnswersComponent.title),
    HseRoute.forChildren(':id', SectionsComponent, new HseRoutes([
        HseRoute.protected(SectionsIntroComponent.route, SectionsIntroComponent, undefined, SectionsIntroComponent.title),
        HseRoute.protected(SectionFloorsAboveComponent.route, SectionFloorsAboveComponent, undefined, SectionFloorsAboveComponent.title),
        HseRoute.protected(SectionNameComponent.route, SectionNameComponent, undefined, SectionNameComponent.title),
        HseRoute.protected(SectionHeightComponent.route, SectionHeightComponent, undefined, SectionHeightComponent.title),
        HseRoute.protected(SectionResidentialUnitsComponent.route, SectionResidentialUnitsComponent, undefined, SectionResidentialUnitsComponent.title),
        HseRoute.protected(SectionYearOfCompletionComponent.route, SectionYearOfCompletionComponent, undefined, SectionYearOfCompletionComponent.title),
        HseRoute.protected(CertificateIssuerComponent.route, CertificateIssuerComponent, undefined, CertificateIssuerComponent.title),
        HseRoute.protected(CertificateNumberComponent.route, CertificateNumberComponent, undefined, CertificateNumberComponent.title),
        HseRoute.protected(SectionYearRangeComponent.route, SectionYearRangeComponent, undefined, SectionYearRangeComponent.title),
        HseRoute.protected(SectionAddressComponent.route, SectionAddressComponent, undefined, SectionAddressComponent.title),
        HseRoute.protected(SectionOtherAddressesComponent.route, SectionOtherAddressesComponent, undefined, SectionOtherAddressesComponent.title),
        HseRoute.protected(SectionPeopleLivingInBuildingComponent.route, SectionPeopleLivingInBuildingComponent, undefined, SectionPeopleLivingInBuildingComponent.title),
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
        NameAllBlocksComponent,
        SectionAnswersComponent,
        CertificateIssuerComponent,
        CertificateNumberComponent
    ],
    imports: [
        RouterModule.forChild(routes.getRoutes()),
        HseAngularModule,
        CommonModule,
        HttpClientModule,
        PipesModule,
        ComponentsModule
    ],
    providers: [
        ...routes.getProviders()
    ]
})
export class SectionsModule {
    public static baseRoute: string = "sections";
}
