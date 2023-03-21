import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, NgModule, OnInit } from "@angular/core";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { AccountablePersonComponent } from "src/app/features/application/accountable-person/accountable-person/accountable-person.component";
import { AccountablePersonTypeComponent } from "src/app/features/application/accountable-person/add-accountable-person/accountable-person-type.component";
import { AddAccountablePersonComponent } from 'src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component';
import { OrganisationTypeComponent } from 'src/app/features/application/accountable-person/organisation/organisation-type/organisation-type.component';
import { OrganisationNameComponent } from 'src/app/features/application/accountable-person/organisation/organisation-name/organisation-name.component';
import { PapWhoAreYouComponent } from 'src/app/features/application/accountable-person/organisation/pap-who-are-you/pap-who-are-you.component';
import { AccountablePersonCheckAnswersComponent } from 'src/app/features/application/accountable-person/check-answers/check-answers.component';
import { PrincipleAccountableSelection } from "./principal/principal.component";
import { ComponentsModule } from "../../../components/components.module";
import { ApDetailsComponent } from "./ap-details/ap-details.component";
import { ApAddressComponent } from "./ap-address/ap-address.component";
import { PapNamedRoleComponent } from "./organisation/pap-named-role/pap-named-role.component";
import { ActingForSameAddressComponent } from "./organisation/acting-for-same-address/acting-for-same-address.component";
import { ActingForAddressComponent } from "./organisation/acting-for-address/acting-for-address.component";
import { LeadNameComponent } from "./organisation/lead-name/lead-name.component";
import { LeadDetailsComponent } from "./organisation/lead-details/lead-details.component";
import { FormsModule } from "@angular/forms";
import { ApNameComponent } from "./ap-name/ap-name.component";
import { PapNameComponent } from "./ap-name/pap-name.component";
import { PapDetailsComponent } from "./ap-details/pap-details.component";
import { ApplicationService } from "src/app/services/application.service";
import { ApAccountableForComponent } from "./accountable-for/accountable-for.component";
import { OrganisationNamedContactComponent } from "./organisation/named-contact/named-contact.component";
import { OrganisationNamedContactDetailsComponent } from "./organisation/named-contact/named-contact-details.component";
import { IndividualAnswersComponent } from "./check-answers/individual-answers.component";
import { OrganisationAnswersComponent } from "./check-answers/organisation-answers.component";
import { PapAddressComponent } from "./ap-address/pap-address.component";

@Component({
  template: '<router-outlet></router-outlet>'
})
export class IdCaptureComponent implements OnInit {

  constructor(private applicationService: ApplicationService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      var accountablePersonId = params['id'];
      this.applicationService.selectAccountablePerson(accountablePersonId);
    });
  }

}

const routes = new HseRoutes([
  HseRoute.unsafe(AccountablePersonComponent.route, AccountablePersonComponent, undefined, AccountablePersonComponent.title),
  HseRoute.unsafe(AddAccountablePersonComponent.route, AddAccountablePersonComponent, undefined, AddAccountablePersonComponent.title),
  HseRoute.unsafe(AccountablePersonCheckAnswersComponent.route, AccountablePersonCheckAnswersComponent, undefined, AccountablePersonCheckAnswersComponent.title),
  HseRoute.forChildren(':id', IdCaptureComponent, new HseRoutes([
    HseRoute.unsafe(PrincipleAccountableSelection.route, PrincipleAccountableSelection, undefined, PrincipleAccountableSelection.title),
    HseRoute.unsafe(PapNamedRoleComponent.route, PapNamedRoleComponent, undefined, PapNamedRoleComponent.title),
    HseRoute.unsafe(ActingForSameAddressComponent.route, ActingForSameAddressComponent, undefined, ActingForSameAddressComponent.title),
    HseRoute.unsafe(ActingForAddressComponent.route, ActingForAddressComponent, undefined, ActingForAddressComponent.title),
    HseRoute.unsafe(AccountablePersonTypeComponent.route, AccountablePersonTypeComponent, undefined, AccountablePersonTypeComponent.title),
    HseRoute.unsafe(LeadNameComponent.route, LeadNameComponent, undefined, LeadNameComponent.title),
    HseRoute.unsafe(LeadDetailsComponent.route, LeadDetailsComponent, undefined, LeadDetailsComponent.title),
    HseRoute.unsafe(ApNameComponent.route, ApNameComponent, undefined, ApNameComponent.title),
    HseRoute.unsafe(PapNameComponent.route, PapNameComponent, undefined, PapNameComponent.title),
    HseRoute.unsafe(ApAddressComponent.route, ApAddressComponent, undefined, ApAddressComponent.title),
    HseRoute.unsafe(PapAddressComponent.route, PapAddressComponent, undefined, PapAddressComponent.title),
    HseRoute.unsafe(ApDetailsComponent.route, ApDetailsComponent, undefined, ApDetailsComponent.title),
    HseRoute.unsafe(PapDetailsComponent.route, PapDetailsComponent, undefined, PapDetailsComponent.title),
    HseRoute.unsafe(ApAccountableForComponent.route, ApAccountableForComponent, undefined, ApAccountableForComponent.title),
    HseRoute.unsafe(OrganisationNamedContactComponent.route, OrganisationNamedContactComponent, undefined, OrganisationNamedContactComponent.title),
    HseRoute.unsafe(OrganisationNamedContactDetailsComponent.route, OrganisationNamedContactDetailsComponent, undefined, OrganisationNamedContactDetailsComponent.title),

    HseRoute.unsafe(OrganisationTypeComponent.route, OrganisationTypeComponent, undefined, OrganisationTypeComponent.title),
    HseRoute.unsafe(OrganisationNameComponent.route, OrganisationNameComponent, undefined, OrganisationNameComponent.title),
    HseRoute.unsafe(PapWhoAreYouComponent.route, PapWhoAreYouComponent, undefined, PapWhoAreYouComponent.title),
  ]))
]);

@NgModule({
  declarations: [
    AccountablePersonComponent,
    AddAccountablePersonComponent,
    AccountablePersonTypeComponent,
    IdCaptureComponent,

    ApNameComponent,
    PapNameComponent,
    ApAddressComponent,
    ApDetailsComponent,
    PapAddressComponent,
    PapDetailsComponent,

    PrincipleAccountableSelection,
    PapWhoAreYouComponent,
    PapNamedRoleComponent,
    ActingForSameAddressComponent,
    ActingForAddressComponent,
    LeadNameComponent,
    LeadDetailsComponent,
    ApAccountableForComponent,
    
    AccountablePersonCheckAnswersComponent,
    IndividualAnswersComponent,
    OrganisationAnswersComponent,

    OrganisationNamedContactComponent,
    OrganisationNamedContactDetailsComponent,

    OrganisationTypeComponent,
    OrganisationNameComponent,
  ],
  providers: [HttpClient, ...routes.getProviders()],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    FormsModule
  ]
})
export class AccountablePersonModule {
  static baseRoute: string = 'accountable-person';

}
