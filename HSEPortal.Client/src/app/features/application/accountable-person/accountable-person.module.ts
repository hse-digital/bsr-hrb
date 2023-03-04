import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AccountablePersonComponent } from "src/app/features/application/accountable-person/accountable-person/accountable-person.component";
import { AccountablePersonTypeComponent } from "src/app/features/application/accountable-person/add-accountable-person/accountable-person-type.component";
import { AddAccountablePersonComponent } from 'src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component';
import { OrganisationTypeComponent } from 'src/app/features/application/accountable-person/organisation/organisation-type/organisation-type.component';
import { OrganisationNameComponent } from 'src/app/features/application/accountable-person/organisation/organisation-name/organisation-name.component';
import { PapWhoAreYouComponent } from 'src/app/features/application/accountable-person/organisation/pap-who-are-you/pap-who-are-you.component';
import { OrganisationCheckAnswersApComponent } from 'src/app/features/application/accountable-person/organisation/organisation-check-answers-ap/organisation-check-answers-ap.component';
import { AccountablePersonCheckAnswersComponent } from 'src/app/features/application/accountable-person/check-answers/check-answers.component';
import { OrganisationAddressComponent } from 'src/app/features/application/accountable-person/organisation/organisation-address/organisation-address.component';
import { PrincipleAccountableSelection } from "./principal/principal.component";
import { AddressModule } from "../../../components/address.module";
import { ApDetailsComponent } from "./ap-details/ap-details.component";
import { ApAddressComponent } from "./ap-address/ap-address.component";
import { PapNamedRoleComponent } from "./organisation/pap-named-role/pap-named-role.component";
import { ActingForSameAddressComponent } from "./organisation/acting-for-same-address/acting-for-same-address.component";
import { ActingForAddressComponent } from "./organisation/acting-for-address/acting-for-address.component";
import { LeadNameComponent } from "./organisation/lead-name/lead-name.component";
import { LeadDetailsComponent } from "./organisation/lead-details/lead-details.component";
import { GovukInputAutocompleteComponent2 } from "./organisation/govuk-input-autocomplete/govuk-input-autocomplete.component";
import { FormsModule } from "@angular/forms";
import { ApNameComponent } from "./ap-name/ap-name.component";
import { PapNameComponent } from "./ap-name/pap-name.component";
import { PapAddressComponent } from "./ap-address/pap-address.component";
import { PapDetailsComponent } from "./ap-details/pap-details.component";

const routes = new HseRoutes([
  HseRoute.unsafe(AccountablePersonComponent.route, AccountablePersonComponent),
  HseRoute.unsafe(AddAccountablePersonComponent.route, AddAccountablePersonComponent),
  HseRoute.forChildren(':id', undefined, new HseRoutes([
    HseRoute.unsafe(PrincipleAccountableSelection.route, PrincipleAccountableSelection),
    HseRoute.unsafe(PapNamedRoleComponent.route, PapNamedRoleComponent),
    HseRoute.unsafe(ActingForSameAddressComponent.route, ActingForSameAddressComponent),
    HseRoute.unsafe(ActingForAddressComponent.route, ActingForAddressComponent),
    HseRoute.unsafe(AccountablePersonTypeComponent.route, AccountablePersonTypeComponent),
    HseRoute.unsafe(LeadNameComponent.route, LeadNameComponent),
    HseRoute.unsafe(LeadDetailsComponent.route, LeadDetailsComponent),
    HseRoute.unsafe(ApNameComponent.route, ApNameComponent),
    HseRoute.unsafe(PapNameComponent.route, PapNameComponent),
    HseRoute.unsafe(ApAddressComponent.route, ApAddressComponent),
    HseRoute.unsafe(PapAddressComponent.route, PapAddressComponent),
    HseRoute.unsafe(ApDetailsComponent.route, ApDetailsComponent),
    HseRoute.unsafe(PapDetailsComponent.route, PapDetailsComponent),

    HseRoute.unsafe(OrganisationTypeComponent.route, OrganisationTypeComponent),
    HseRoute.unsafe(OrganisationNameComponent.route, OrganisationNameComponent),
    HseRoute.unsafe(OrganisationAddressComponent.route, OrganisationAddressComponent),
    HseRoute.unsafe(PapWhoAreYouComponent.route, PapWhoAreYouComponent),
    HseRoute.unsafe(OrganisationCheckAnswersApComponent.route, OrganisationCheckAnswersApComponent),
    HseRoute.unsafe(AccountablePersonCheckAnswersComponent.route, AccountablePersonCheckAnswersComponent),
  ]))
]);

@NgModule({
    declarations: [
        AccountablePersonComponent,
        AddAccountablePersonComponent,
        AccountablePersonTypeComponent,

        ApNameComponent,
        PapNameComponent,
        ApAddressComponent,
        PapAddressComponent,
        ApDetailsComponent,
        PapDetailsComponent,

        PrincipleAccountableSelection,
        PapWhoAreYouComponent,
        PapNamedRoleComponent,
        ActingForSameAddressComponent,
        ActingForAddressComponent,
        LeadNameComponent,
        LeadDetailsComponent,
        AccountablePersonCheckAnswersComponent,

        OrganisationTypeComponent,
        OrganisationNameComponent,
        OrganisationCheckAnswersApComponent,
        OrganisationAddressComponent,

        GovukInputAutocompleteComponent2
    ],
    providers: [HttpClient, ...routes.getProviders()],
    imports: [
        RouterModule.forChild(routes.getRoutes()),
        HseAngularModule,
        CommonModule,
        HttpClientModule,
        AddressModule,
        FormsModule
    ]
})
export class AccountablePersonModule {
  static baseRoute: string = 'accountable-person';
}
