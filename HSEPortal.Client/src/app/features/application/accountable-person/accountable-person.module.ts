import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { HseRoute, HseRoutes } from "src/app/services/hse.route";

import { FormsModule } from "@angular/forms";
import { AccountablePersonComponent } from "src/app/features/application/accountable-person/accountable-person/accountable-person.component";
import { AccountablePersonTypeComponent } from "src/app/features/application/accountable-person/add-accountable-person/accountable-person-type.component";
import { AddAccountablePersonComponent } from 'src/app/features/application/accountable-person/add-accountable-person/add-accountable-person.component';
import { AccountablePersonCheckAnswersComponent } from 'src/app/features/application/accountable-person/check-answers/check-answers.component';
import { OrganisationNameComponent } from 'src/app/features/application/accountable-person/organisation/organisation-name/organisation-name.component';
import { OrganisationTypeComponent } from 'src/app/features/application/accountable-person/organisation/organisation-type/organisation-type.component';
import { PapWhoAreYouComponent } from 'src/app/features/application/accountable-person/organisation/pap-who-are-you/pap-who-are-you.component';
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../../components/components.module";
import { ApAccountableForComponent } from "./accountable-for/accountable-for.component";
import { ApAddressComponent } from "./ap-address/ap-address.component";
import { PapAddressComponent } from "./ap-address/pap-address.component";
import { ApDetailsComponent } from "./ap-details/ap-details.component";
import { PapDetailsComponent } from "./ap-details/pap-details.component";
import { ApNameComponent } from "./ap-name/ap-name.component";
import { PapNameComponent } from "./ap-name/pap-name.component";
import { IndividualAnswersComponent } from "./check-answers/individual-answers.component";
import { OrganisationAnswersComponent } from "./check-answers/organisation-answers.component";
import { ActingForAddressComponent } from "./organisation/acting-for-address/acting-for-address.component";
import { ActingForSameAddressComponent } from "./organisation/acting-for-same-address/acting-for-same-address.component";
import { LeadDetailsComponent } from "./organisation/lead-details/lead-details.component";
import { LeadNameComponent } from "./organisation/lead-name/lead-name.component";
import { OrganisationNamedContactDetailsComponent } from "./organisation/named-contact/named-contact-details.component";
import { OrganisationNamedContactComponent } from "./organisation/named-contact/named-contact.component";
import { PapNamedRoleComponent } from "./organisation/pap-named-role/pap-named-role.component";
import { PrincipleAccountableSelection } from "./principal/principal.component";
import { PipesModule } from "src/app/pipes/pipes.module";
import { AreasAccountabilityComponent } from './areas-accountability/areas-accountability.component';
import { NotAllocatedAccountabilityAreasComponent } from './not-allocated-accountability-areas/not-allocated-accountability-areas.component';
import { OutgoingAccountabilityPageComponent } from "./outgoing-accountability/outgoing-accountability.component";
import { ConfirmRemoveComponent } from "./check-answers/confirm-remove.component";

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
  HseRoute.protected(AccountablePersonComponent.route, AccountablePersonComponent, AccountablePersonComponent.title),
  HseRoute.protected(AddAccountablePersonComponent.route, AddAccountablePersonComponent, AddAccountablePersonComponent.title),
  HseRoute.protected(AccountablePersonCheckAnswersComponent.route, AccountablePersonCheckAnswersComponent, AccountablePersonCheckAnswersComponent.title),
  HseRoute.protected(AreasAccountabilityComponent.route, AreasAccountabilityComponent, AreasAccountabilityComponent.title),
  HseRoute.protected(OutgoingAccountabilityPageComponent.route, OutgoingAccountabilityPageComponent, OutgoingAccountabilityPageComponent.title),
  HseRoute.protected(NotAllocatedAccountabilityAreasComponent.route, NotAllocatedAccountabilityAreasComponent, NotAllocatedAccountabilityAreasComponent.title),
  HseRoute.forChildren(':id', IdCaptureComponent, new HseRoutes([
    HseRoute.protected(PrincipleAccountableSelection.route, PrincipleAccountableSelection, PrincipleAccountableSelection.title),
    HseRoute.protected(PapNamedRoleComponent.route, PapNamedRoleComponent, PapNamedRoleComponent.title),
    HseRoute.protected(ActingForSameAddressComponent.route, ActingForSameAddressComponent, ActingForSameAddressComponent.title),
    HseRoute.protected(ActingForAddressComponent.route, ActingForAddressComponent, ActingForAddressComponent.title),
    HseRoute.protected(AccountablePersonTypeComponent.route, AccountablePersonTypeComponent, AccountablePersonTypeComponent.title),
    HseRoute.protected(LeadNameComponent.route, LeadNameComponent, LeadNameComponent.title),
    HseRoute.protected(LeadDetailsComponent.route, LeadDetailsComponent, LeadDetailsComponent.title),
    HseRoute.protected(ApNameComponent.route, ApNameComponent, ApNameComponent.title),
    HseRoute.protected(PapNameComponent.route, PapNameComponent, PapNameComponent.title),
    HseRoute.protected(ApAddressComponent.route, ApAddressComponent, ApAddressComponent.title),
    HseRoute.protected(PapAddressComponent.route, PapAddressComponent, PapAddressComponent.title),
    HseRoute.protected(ApDetailsComponent.route, ApDetailsComponent, ApDetailsComponent.title),
    HseRoute.protected(PapDetailsComponent.route, PapDetailsComponent, PapDetailsComponent.title),
    HseRoute.protected(ApAccountableForComponent.route, ApAccountableForComponent, ApAccountableForComponent.title),
    HseRoute.protected(OrganisationNamedContactComponent.route, OrganisationNamedContactComponent, OrganisationNamedContactComponent.title),
    HseRoute.protected(OrganisationNamedContactDetailsComponent.route, OrganisationNamedContactDetailsComponent, OrganisationNamedContactDetailsComponent.title),

    HseRoute.protected(OrganisationTypeComponent.route, OrganisationTypeComponent, OrganisationTypeComponent.title),
    HseRoute.protected(OrganisationNameComponent.route, OrganisationNameComponent, OrganisationNameComponent.title),
    HseRoute.protected(PapWhoAreYouComponent.route, PapWhoAreYouComponent, PapWhoAreYouComponent.title),
    
    
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
    ConfirmRemoveComponent,

    OrganisationNamedContactComponent,
    OrganisationNamedContactDetailsComponent,

    OrganisationTypeComponent,
    OrganisationNameComponent,
    AreasAccountabilityComponent,
    OutgoingAccountabilityPageComponent,
    NotAllocatedAccountabilityAreasComponent,
  ],
  providers: [HttpClient, ...routes.getProviders()],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    FormsModule,
    PipesModule,
  ]
})
export class AccountablePersonModule {
  static baseRoute: string = 'accountable-person';

}
