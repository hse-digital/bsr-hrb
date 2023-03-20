import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { PrincipleAccountableSelection } from '../principal/principal.component';
import { OrganisationTypeComponent } from '../organisation/organisation-type/organisation-type.component';
import { AccountablePersonCheckAnswersComponent } from '../check-answers/check-answers.component';

@Component({
  templateUrl: './accountable-person.component.html'
})
export class AccountablePersonComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = '';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  accountablePersonHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  previousAnswer?: string;
  ngOnInit(): void {
    this.previousAnswer = this.applicationService.model.PrincipalAccountableType;
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.AccountablePersonsInProgress;
    this.applicationService.updateLocalStorage();
    this.applicationService.updateApplication();
  }

  canContinue(): boolean {
    this.accountablePersonHasErrors = !this.applicationService.model.PrincipalAccountableType;
    return !this.accountablePersonHasErrors;
  }

  override async onSave(): Promise<void> {
    let newAnswer = this.applicationService.model.PrincipalAccountableType;
    if (this.previousAnswer && this.previousAnswer != newAnswer) {
      var replaceAp = new AccountablePersonModel();
      replaceAp.Type = newAnswer;

      this.applicationService.model.AccountablePersons[0] = replaceAp;
      this.applicationService._currentAccountablePersonIndex = 0;
    } else if (!this.previousAnswer) {
      await this.applicationService.startAccountablePersonEdit();
    }
  }

  async navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.previousAnswer && this.previousAnswer == this.applicationService.model.PrincipalAccountableType) {
      return navigationService.navigateAppend(AccountablePersonCheckAnswersComponent.route, activatedRoute);
    }

    let accountablePerson = `accountable-person-${this.applicationService._currentAccountablePersonIndex + 1}`
    let route = this.applicationService.currentAccountablePerson.Type == 'organisation' ? OrganisationTypeComponent.route : PrincipleAccountableSelection.route;

    return navigationService.navigateAppend(`${accountablePerson}/${route}`, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.model.Sections && this.applicationService.model.Sections.length > 0;
  }
}
