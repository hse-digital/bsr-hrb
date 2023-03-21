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
  HseRoute.protected(AccountablePersonComponent.route, AccountablePersonComponent),
  HseRoute.protected(AddAccountablePersonComponent.route, AddAccountablePersonComponent),
  HseRoute.protected(AccountablePersonCheckAnswersComponent.route, AccountablePersonCheckAnswersComponent),
  HseRoute.forChildren(':id', IdCaptureComponent, new HseRoutes([
    HseRoute.protected(PrincipleAccountableSelection.route, PrincipleAccountableSelection),
    HseRoute.protected(PapNamedRoleComponent.route, PapNamedRoleComponent),
    HseRoute.protected(ActingForSameAddressComponent.route, ActingForSameAddressComponent),
    HseRoute.protected(ActingForAddressComponent.route, ActingForAddressComponent),
    HseRoute.protected(AccountablePersonTypeComponent.route, AccountablePersonTypeComponent),
    HseRoute.protected(LeadNameComponent.route, LeadNameComponent),
    HseRoute.protected(LeadDetailsComponent.route, LeadDetailsComponent),
    HseRoute.protected(ApNameComponent.route, ApNameComponent),
    HseRoute.protected(PapNameComponent.route, PapNameComponent),
    HseRoute.protected(ApAddressComponent.route, ApAddressComponent),
    HseRoute.protected(PapAddressComponent.route, PapAddressComponent),
    HseRoute.protected(ApDetailsComponent.route, ApDetailsComponent),
    HseRoute.protected(PapDetailsComponent.route, PapDetailsComponent),
    HseRoute.protected(ApAccountableForComponent.route, ApAccountableForComponent),
    HseRoute.protected(OrganisationNamedContactComponent.route, OrganisationNamedContactComponent),
    HseRoute.protected(OrganisationNamedContactDetailsComponent.route, OrganisationNamedContactDetailsComponent),

    HseRoute.protected(OrganisationTypeComponent.route, OrganisationTypeComponent),
    HseRoute.protected(OrganisationNameComponent.route, OrganisationNameComponent),
    HseRoute.protected(PapWhoAreYouComponent.route, PapWhoAreYouComponent),
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
