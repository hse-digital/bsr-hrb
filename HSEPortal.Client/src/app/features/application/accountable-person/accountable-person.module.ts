import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AccountablePersonComponent } from "src/app/features/application/accountable-person/accountable-person/accountable-person.component";
import { OtherAccountablePersonComponent } from "src/app/features/application/accountable-person/other-accountable-person/other-accountable-person.component";
import { AddAccountablePersonComponent } from 'src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component';
import { OrganisationTypeComponent } from 'src/app/features/application/accountable-person/organisation/organisation-type/organisation-type.component';
import { OrganisationNameApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-name-ap/organisation-name-ap.component';
import { OrganisationNamedContactApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-named-contact-ap/organisation-named-contact-ap.component';
import { OrganisationAreasApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-areas-ap/organisation-areas-ap.component';
import { OrganisationJobRoleApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-job-role-ap/organisation-job-role-ap.component';
import { OrganisationCheckAnswersApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-check-answers-ap/organisation-check-answers-ap.component';
import { IndividualCheckAnswersApComponent } from 'src/app/features/application/accountable-person/individual/individual-check-answers-ap/individual-check-answers-ap.component';
import { IndividualAddressComponent } from 'src/app/features/application/accountable-person/individual/individual-address/individual-address.component';
import { OrganisationAddressComponent } from 'src/app/features/application/accountable-person/organisation/organisation-address/organisation-address.component';
import { PrincipleAccountableSelection } from "./individual/principal/principal.component";
import { AddressModule } from "../../../components/address.module";
import { PapNameComponent } from "./individual/pap-name/pap-name.component";
import { PapDetailsComponent } from "./individual/pap-details/pap-details.component";

const routes = new HseRoutes([
  HseRoute.unsafe(AccountablePersonComponent.route, AccountablePersonComponent),
  HseRoute.unsafe(OtherAccountablePersonComponent.route, OtherAccountablePersonComponent),
  HseRoute.unsafe(AddAccountablePersonComponent.route, AddAccountablePersonComponent),
  HseRoute.forChildren(':id', undefined, new HseRoutes([
    HseRoute.unsafe(PrincipleAccountableSelection.route, PrincipleAccountableSelection),
    HseRoute.unsafe(PapNameComponent.route, PapNameComponent),
    HseRoute.unsafe(PapDetailsComponent.route, PapDetailsComponent),

    HseRoute.unsafe(OrganisationTypeComponent.route, OrganisationTypeComponent),
    HseRoute.unsafe(OrganisationNameApComponent.route, OrganisationNameApComponent),
    HseRoute.unsafe(OrganisationAddressComponent.route, OrganisationAddressComponent),
    HseRoute.unsafe(OrganisationAreasApComponent.route, OrganisationAreasApComponent),
    HseRoute.unsafe(OrganisationNamedContactApComponent.route, OrganisationNamedContactApComponent),
    HseRoute.unsafe(OrganisationJobRoleApComponent.route, OrganisationJobRoleApComponent),
    HseRoute.unsafe(OrganisationCheckAnswersApComponent.route, OrganisationCheckAnswersApComponent),
    HseRoute.unsafe(IndividualAddressComponent.route, IndividualAddressComponent),
    HseRoute.unsafe(IndividualCheckAnswersApComponent.route, IndividualCheckAnswersApComponent),
  ]))
]);

@NgModule({
    declarations: [
        AccountablePersonComponent,
        OtherAccountablePersonComponent,
        AddAccountablePersonComponent,

        PrincipleAccountableSelection,
        PapNameComponent,
        PapDetailsComponent,

        OrganisationTypeComponent,
        OrganisationNameApComponent,
        OrganisationNamedContactApComponent,
        OrganisationAreasApComponent,
        OrganisationJobRoleApComponent,
        OrganisationCheckAnswersApComponent,
        IndividualCheckAnswersApComponent,
        IndividualAddressComponent,
        OrganisationAddressComponent,
    ],
    providers: [HttpClient, ...routes.getProviders()],
    imports: [
        RouterModule.forChild(routes.getRoutes()),
        HseAngularModule,
        CommonModule,
        HttpClientModule,
        AddressModule
    ]
})
export class AccountablePersonModule {
  static baseRoute: string = 'accountable-person';
}
