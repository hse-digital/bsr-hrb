import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { AccountablePersonTypeComponent } from './accountable-person-type.component';
import { AreasAccountabilityComponent } from '../areas-accountability/areas-accountability.component';

@Component({
  selector: 'hse-add-accountable-person',
  templateUrl: './add-accountable-person.component.html',
})
export class AddAccountablePersonComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'add-more';
  static title: string = "Add another accountable person - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  addAccountablePerson?: string;
  addAccountablePersonHasError = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.AccountablePersonsInProgress;
    
    this.applicationService.updateApplication();
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

    return navigationService.navigateRelative(AreasAccountabilityComponent.route, activatedRoute);
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
    return aps.slice(1, aps.length).filter(ap => ap.FirstName !== undefined || ap.LastName !== undefined || ap.OrganisationName !== undefined);
  }

  apName(ap: AccountablePersonModel) {
    if (ap.Type == 'organisation')
      return ap.OrganisationName;

    return `${ap.FirstName} ${ap.LastName}`;
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    return this.applicationService.model.AccountablePersons?.length >= 1;
  }
}
