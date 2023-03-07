import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { PrincipleAccountableSelection } from '../principal/principal.component';
import { OrganisationTypeComponent } from '../organisation/organisation-type/organisation-type.component';

@Component({
  selector: 'hse-accountable-person',
  templateUrl: './accountable-person.component.html'
})
export class AccountablePersonComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = '';

  accountablePersonHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }
  
  ngOnInit(): void {
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.AccountablePersonsInProgress;
    this.applicationService.updateLocalStorage();
    this.applicationService.updateApplication();
  }

  canContinue(): boolean {
    this.accountablePersonHasErrors = !this.applicationService.model.PrincipalAccountableType;
    return !this.accountablePersonHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let accountablePerson = this.applicationService.startAccountablePersonEdit();
    let route = this.applicationService.currentAccountablePerson.Type == 'organisation' ? OrganisationTypeComponent.route : PrincipleAccountableSelection.route;

    return navigationService.navigateAppend(`${accountablePerson}/${route}`, activatedRoute);
  }
}
