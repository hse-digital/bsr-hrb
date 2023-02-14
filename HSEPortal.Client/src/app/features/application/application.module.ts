import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationStartComponent } from "./components/application-start/application-start.component";
import { ApplicationContinueComponent } from "./components/application-continue/application-continue.component";
import { SecurityCodeComponent } from "./components/security-code/security-code.component";
import { NewApplicationModule } from "./new-application/new-application.module";
import { ApplicationCompletedComponent } from "./components/application-completed/application-completed.component";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { ApplicationService } from "src/app/services/application.service";
import { BuildingModule } from "./components/building/building.module";
import { IndividualContactDetailsApComponent } from './accountable-person/individual/individual-contact-details-ap/individual-contact-details-ap.component';
import { AccountablePersonComponent } from "./accountable-person/accountable-person/accountable-person.component";
import { OtherAccountablePersonComponent } from "./accountable-person/other-accountable-person/other-accountable-person.component";
import { AddAccountablePersonComponent } from './accountable-person/add-accountable-person/add-accountable-person.component';
import { IndividualNameApComponent } from './accountable-person/individual/individual-name-ap/individual-name-ap.component';
import { OrganisationTypeApComponent } from './accountable-person/organisation/organisation-type-ap/organisation-type-ap.component';
import { OrganisationNameApComponent } from './accountable-person/organisation/organisation-name-ap/organisation-name-ap.component';
import { OrganisationNamedContactApComponent } from './accountable-person/organisation/organisation-named-contact-ap/organisation-named-contact-ap.component';
import { OrganisationAreasApComponent } from './accountable-person/organisation/organisation-areas-ap/organisation-areas-ap.component';
import { OrganisationJobRoleApComponent } from './accountable-person/organisation/organisation-job-role-ap/organisation-job-role-ap.component';
import { OrganisationCheckAnswersApComponent } from './accountable-person/organisation/organisation-check-answers-ap/organisation-check-answers-ap.component';
import { IndividualCheckAnswersApComponent } from './accountable-person/individual/individual-check-answers-ap/individual-check-answers-ap.component';
import { IndividualAddressComponent } from './accountable-person/individual/individual-address/individual-address.component';
import { OrganisationAddressComponent } from './accountable-person/organisation/organisation-address/organisation-address.component';

const routes = new HseRoutes([
  HseRoute.unsafe(ApplicationStartComponent.route, ApplicationStartComponent),
  HseRoute.unsafe(ApplicationContinueComponent.route, ApplicationContinueComponent),
  HseRoute.unsafe(SecurityCodeComponent.route, SecurityCodeComponent),
  HseRoute.unsafe(AccountablePersonComponent.route, AccountablePersonComponent),
  HseRoute.unsafe(OtherAccountablePersonComponent.route, OtherAccountablePersonComponent),
  HseRoute.unsafe(AddAccountablePersonComponent.route, AddAccountablePersonComponent),
  HseRoute.unsafe(OrganisationTypeApComponent.route, OrganisationTypeApComponent),
  HseRoute.unsafe(OrganisationNameApComponent.route, OrganisationNameApComponent),
  HseRoute.unsafe(OrganisationAddressComponent.route, OrganisationAddressComponent),
  HseRoute.unsafe(OrganisationAreasApComponent.route, OrganisationAreasApComponent),
  HseRoute.unsafe(OrganisationNamedContactApComponent.route, OrganisationNamedContactApComponent),
  HseRoute.unsafe(OrganisationJobRoleApComponent.route, OrganisationJobRoleApComponent),
  HseRoute.unsafe(OrganisationCheckAnswersApComponent.route, OrganisationCheckAnswersApComponent),
  HseRoute.unsafe(IndividualNameApComponent.route, IndividualNameApComponent),
  HseRoute.unsafe(IndividualContactDetailsApComponent.route, IndividualContactDetailsApComponent),
  HseRoute.unsafe(IndividualAddressComponent.route, IndividualAddressComponent),
  HseRoute.unsafe(IndividualCheckAnswersApComponent.route, IndividualCheckAnswersApComponent),
  HseRoute.forChildren(NewApplicationModule.baseRoute, () => import('./new-application/new-application.module').then(m => m.NewApplicationModule)),
  HseRoute.forChildren(':id', () => import('./continue-application/continue-application.module').then(m => m.ContinueApplicationModule)),
  HseRoute.forChildren(BuildingModule.baseRoute, () => import('./components/building/building.module').then(m => m.BuildingModule)),
]);

@NgModule({
  declarations: [
    ApplicationStartComponent,
    ApplicationContinueComponent,
    SecurityCodeComponent,
    ApplicationCompletedComponent,
    AccountablePersonComponent,
    OtherAccountablePersonComponent,
    IndividualContactDetailsApComponent,
    AddAccountablePersonComponent,
    IndividualNameApComponent,
    OrganisationTypeApComponent,
    OrganisationNameApComponent,
    OrganisationNamedContactApComponent,
    OrganisationAreasApComponent,
    OrganisationJobRoleApComponent,
    OrganisationCheckAnswersApComponent,
    IndividualCheckAnswersApComponent,
    IndividualAddressComponent,
    OrganisationAddressComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [HttpClient, ApplicationService]
})
export class ApplicationModule {
  static baseRoute: string = 'application';
}
