import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { IndividualContactDetailsApComponent } from 'src/app/features/application/accountable-person/individual/individual-contact-details-ap/individual-contact-details-ap.component';
import { AccountablePersonComponent } from "src/app/features/application/accountable-person/accountable-person/accountable-person.component";
import { OtherAccountablePersonComponent } from "src/app/features/application/accountable-person/other-accountable-person/other-accountable-person.component";
import { AddAccountablePersonComponent } from 'src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component';
import { IndividualNameApComponent } from 'src/app/features/application/accountable-person/individual/individual-name-ap/individual-name-ap.component';
import { OrganisationTypeApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-type-ap/organisation-type-ap.component';
import { OrganisationNameApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-name-ap/organisation-name-ap.component';
import { OrganisationNamedContactApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-named-contact-ap/organisation-named-contact-ap.component';
import { OrganisationAreasApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-areas-ap/organisation-areas-ap.component';
import { OrganisationJobRoleApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-job-role-ap/organisation-job-role-ap.component';
import { OrganisationCheckAnswersApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-check-answers-ap/organisation-check-answers-ap.component';
import { IndividualCheckAnswersApComponent } from 'src/app/features/application/accountable-person/individual/individual-check-answers-ap/individual-check-answers-ap.component';
import { IndividualAddressComponent } from 'src/app/features/application/accountable-person/individual/individual-address/individual-address.component';
import { OrganisationAddressComponent } from 'src/app/features/application/accountable-person/organisation/organisation-address/organisation-address.component';

const routes = new HseRoutes([
  HseRoute.unsafe(AccountablePersonComponent.route, AccountablePersonComponent),
  HseRoute.unsafe(OtherAccountablePersonComponent.route, OtherAccountablePersonComponent),
  HseRoute.unsafe(AddAccountablePersonComponent.route, AddAccountablePersonComponent),
  HseRoute.forChildren(':id', undefined, new HseRoutes([
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
  ]))

]);

@NgModule({
  declarations: [
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
  providers: [HttpClient, ...routes.getProviders()]
})
export class AccountablePersonModule {
  static baseRoute: string = 'accountable-person';
}
