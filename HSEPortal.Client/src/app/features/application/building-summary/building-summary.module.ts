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
import { SectionNameComponent } from "./name/name.component";
import { SectionOtherAddressesComponent } from "./other-addresses/other-addresses.component";
import { SectionPeopleLivingInBuildingComponent } from "./people-living-in-building/people-living-in-building.component";
import { SectionResidentialUnitsComponent } from "./residential-units/residential-units.component";
import { BuildingSummaryComponent } from "./building-summary.component";
import { SectionYearOfCompletionComponent } from "./year-of-completion/year-of-completion.component";
import { SectionYearRangeComponent } from "./year-range/year-range.component";
import { NotNeedRegisterSingleStructureComponent } from './not-need-register-single-structure/not-need-register-single-structure.component';
import { NotNeedRegisterMultiStructureComponent } from './not-need-register-multi-structure/not-need-register-multi-structure.component';
import { AlreadyRegisteredSingleComponent } from './duplicates/already-registered-single/already-registered-single.component';
import { AlreadyRegisteredMultiComponent } from './duplicates/already-registered-multi/already-registered-multi.component';
import { KeepStructureDeclarationComponent } from './duplicates/keep-structure-declaration/keep-structure-declaration.component';
import { WhyContinueRegisterComponent } from './duplicates/why-continue-register/why-continue-register.component';
import { NotNeedRegisterMultiDuplicatedStructuresComponent } from './duplicates/not-reg-multi-dupli-struct/not-register-multi-dupli-structures.component';
import { WhoIssuedCertificateComponent } from './who-issued-certificate/who-issued-certificate.component';
import { CompletionCertificateDateComponent } from './completion-certificate-date/completion-certificate-date.component';
import { UploadCompletionCertificateComponent } from './upload-completion-certificate/upload-completion-certificate.component';
import { FormsModule } from "@angular/forms";

const routes = new HseRoutes([
  HseRoute.protected(AddMoreSectionsComponent.route, AddMoreSectionsComponent, undefined),
  HseRoute.protected(MoreInformationComponent.route, MoreInformationComponent, MoreInformationComponent.title),
  HseRoute.protected(SectionCheckAnswersComponent.route, SectionCheckAnswersComponent, SectionCheckAnswersComponent.title),
  HseRoute.protected(NotNeedRegisterMultiDuplicatedStructuresComponent.route, NotNeedRegisterMultiDuplicatedStructuresComponent, NotNeedRegisterMultiDuplicatedStructuresComponent.title),
  HseRoute.forChildren(':id', BuildingSummaryComponent, new HseRoutes([
    HseRoute.protected(SectionsIntroComponent.route, SectionsIntroComponent, SectionsIntroComponent.title),
    HseRoute.protected(SectionFloorsAboveComponent.route, SectionFloorsAboveComponent, SectionFloorsAboveComponent.title),
    HseRoute.protected(SectionNameComponent.route, SectionNameComponent, SectionNameComponent.title),
    HseRoute.protected(SectionHeightComponent.route, SectionHeightComponent, SectionHeightComponent.title),
    HseRoute.protected(SectionResidentialUnitsComponent.route, SectionResidentialUnitsComponent, SectionResidentialUnitsComponent.title),
    HseRoute.protected(SectionYearOfCompletionComponent.route, SectionYearOfCompletionComponent, SectionYearOfCompletionComponent.title),
    HseRoute.protected(CertificateIssuerComponent.route, CertificateIssuerComponent, CertificateIssuerComponent.title),
    HseRoute.protected(CertificateNumberComponent.route, CertificateNumberComponent, CertificateNumberComponent.title),
    HseRoute.protected(SectionYearRangeComponent.route, SectionYearRangeComponent, SectionYearRangeComponent.title),
    HseRoute.protected(SectionAddressComponent.route, SectionAddressComponent, SectionAddressComponent.title),
    HseRoute.protected(SectionOtherAddressesComponent.route, SectionOtherAddressesComponent, SectionOtherAddressesComponent.title),
    HseRoute.protected(SectionPeopleLivingInBuildingComponent.route, SectionPeopleLivingInBuildingComponent, SectionPeopleLivingInBuildingComponent.title),
    HseRoute.protected(NotNeedRegisterSingleStructureComponent.route, NotNeedRegisterSingleStructureComponent, NotNeedRegisterSingleStructureComponent.title),
    HseRoute.protected(NotNeedRegisterMultiStructureComponent.route, NotNeedRegisterMultiStructureComponent, NotNeedRegisterMultiStructureComponent.title),
    HseRoute.protected(AlreadyRegisteredSingleComponent.route, AlreadyRegisteredSingleComponent, AlreadyRegisteredSingleComponent.title),
    HseRoute.protected(AlreadyRegisteredMultiComponent.route, AlreadyRegisteredMultiComponent, AlreadyRegisteredMultiComponent.title),
    HseRoute.protected(KeepStructureDeclarationComponent.route, KeepStructureDeclarationComponent, KeepStructureDeclarationComponent.title),
    HseRoute.protected(WhyContinueRegisterComponent.route, WhyContinueRegisterComponent, WhyContinueRegisterComponent.title),
    HseRoute.protected(WhoIssuedCertificateComponent.route, WhoIssuedCertificateComponent, WhoIssuedCertificateComponent.title),
    HseRoute.protected(CompletionCertificateDateComponent.route, CompletionCertificateDateComponent, CompletionCertificateDateComponent.title),
    HseRoute.protected(UploadCompletionCertificateComponent.route, UploadCompletionCertificateComponent, UploadCompletionCertificateComponent.title),
  ])),
]);

@NgModule({
  declarations: [
    BuildingSummaryComponent,
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
    SectionAnswersComponent,
    CertificateIssuerComponent,
    CertificateNumberComponent,
    NotNeedRegisterSingleStructureComponent,
    NotNeedRegisterMultiStructureComponent,
    AlreadyRegisteredSingleComponent,
    AlreadyRegisteredMultiComponent,
    KeepStructureDeclarationComponent,
    WhyContinueRegisterComponent,
    NotNeedRegisterMultiDuplicatedStructuresComponent,
    WhoIssuedCertificateComponent,
    CompletionCertificateDateComponent,
    UploadCompletionCertificateComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    PipesModule,
    ComponentsModule,
    FormsModule
  ],
  providers: [
    ...routes.getProviders()
  ]
})
export class BuildingSummaryModule {
  public static baseRoute: string = "sections";
}
