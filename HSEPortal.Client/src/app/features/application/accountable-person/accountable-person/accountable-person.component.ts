import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStage } from 'src/app/services/application.service';
import { PrincipleAccountableSelection } from '../principal/principal.component';
import { OrganisationTypeComponent } from '../organisation/organisation-type/organisation-type.component';
import { AccountablePersonCheckAnswersComponent } from '../check-answers/check-answers.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { AccountablePersonNavigation } from '../accountable-person.navigation';
import { PapNameComponent } from '../ap-name/pap-name.component';

@Component({
  templateUrl: './accountable-person.component.html'
})
export class AccountablePersonComponent extends PageComponent<string> {
  static route: string = '';
  static title: string = "Is the principal accountable person for an organisation or an individual? - Register a high-rise building - GOV.UK";

  accountablePersonHasErrors = false;
  previousAnswer?: string;

  constructor(activatedRoute: ActivatedRoute, private apNavigation: AccountablePersonNavigation) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.previousAnswer = this.applicationService.model.PrincipalAccountableType;
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.AccountablePersonsInProgress;

    this.model = applicationService.model.PrincipalAccountableType;

    await this.applicationService.updateApplication();
    await this.applicationService.updateDynamicsAccountablePersonsStage();

  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.BlocksInBuildingComplete) == BuildingApplicationStage.BlocksInBuildingComplete;
  }

  override isValid(): boolean {
    this.accountablePersonHasErrors = !this.model;
    return !this.accountablePersonHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.isChangeAmendmentInProgress && this.applicationService.currentAccountablePerson.Type == 'individual') {
      let accountablePerson = `accountable-person-${this.applicationService._currentAccountablePersonIndex + 1}`
      return this.navigationService.navigateAppend(`${accountablePerson}/${PapNameComponent.route}`, this.activatedRoute);
    } else {
      let nextRoute = this.apNavigation.getNextRoute();
      if (this.previousAnswer && this.previousAnswer == this.applicationService.model.PrincipalAccountableType && nextRoute.endsWith(AccountablePersonCheckAnswersComponent.route)) {
        return this.navigationService.navigateAppend(AccountablePersonCheckAnswersComponent.route, this.activatedRoute);
      }

      let accountablePerson = `accountable-person-${this.applicationService._currentAccountablePersonIndex + 1}`
      let route = this.applicationService.currentAccountablePerson.Type == 'organisation' ? OrganisationTypeComponent.route : PrincipleAccountableSelection.route;

      return this.navigationService.navigateAppend(`${accountablePerson}/${route}`, this.activatedRoute);
    }
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.PrincipalAccountableType = this.model;
    let newAnswer = this.applicationService.model.PrincipalAccountableType;
    if ((this.previousAnswer && this.previousAnswer != newAnswer) || this.isNewPap()) {
      var replaceAp = new AccountablePersonModel();
      replaceAp.Type = newAnswer;

      this.applicationService.currentVersion.AccountablePersons[0] = replaceAp;
      this.applicationService._currentAccountablePersonIndex = 0;
    } else if (!this.previousAnswer) {
      await this.applicationService.startAccountablePersonEdit();
    }
  }

  private isNewPap() {
    return this.applicationService.isChangeAmendmentInProgress && !this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewPap;
  }

}
