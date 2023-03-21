import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { AccountablePersonCheckAnswersComponent } from '../check-answers/check-answers.component';
import { AccountablePersonTypeComponent } from './accountable-person-type.component';

@Component({
  selector: 'hse-add-accountable-person',
  templateUrl: './add-accountable-person.component.html',
})
export class AddAccountablePersonComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'add-more';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  addAccountablePerson?: string;
  addAccountablePersonHasError = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  ngOnInit(): void {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.AccountablePersonsInProgress;
    this.applicationService.updateLocalStorage();
    this.applicationService.updateApplication();
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return (!!this.applicationService.currentAccountablePerson.LeadJobRole)
      || (!!this.applicationService.currentAccountablePerson.LeadEmail && !!this.applicationService.currentAccountablePerson.LeadPhoneNumber && !!this.applicationService.currentAccountablePerson.LeadJobRole)
      || (!!this.applicationService.currentAccountablePerson.IsPrincipal && this.applicationService.currentAccountablePerson.IsPrincipal == 'yes')
      || (!!this.applicationService.currentAccountablePerson.Type && (!!this.applicationService.currentAccountablePerson.Address || !!this.applicationService.currentAccountablePerson.PapAddress))  
  }

  canContinue(): boolean {
    this.addAccountablePersonHasError = !this.addAccountablePerson;
    return !this.addAccountablePersonHasError;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.addAccountablePerson == 'yes') {
      let newAp = this.applicationService.startNewAccountablePerson();
      return navigationService.navigateRelative(`${newAp}/${AccountablePersonTypeComponent.route}`, activatedRoute);
    }


    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.AccountablePersonsComplete;
    this.applicationService.updateLocalStorage();
    this.applicationService.updateApplication();

    return navigationService.navigateRelative(AccountablePersonCheckAnswersComponent.route, activatedRoute);
  }

  principalName() {
    var pap = this.applicationService.model.AccountablePersons[0];
    if (pap.Type == 'organisation') return pap.OrganisationName;

    if (pap.IsPrincipal == 'yes') {
      if (pap.Type == 'individual')
        return `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
    }

    return `${pap.FirstName} ${pap.LastName}`;
  }

  otherAps() {
    var aps = this.applicationService.model.AccountablePersons;
    return aps.slice(1, aps.length);
  }

  apName(ap: AccountablePersonModel) {
    if (ap.Type == 'organisation')
      return ap.OrganisationName;

    return `${ap.FirstName} ${ap.LastName}`;
  }

}
