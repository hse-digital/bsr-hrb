import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { PrincipleAccountableSelection } from '../individual/principal/principal.component';

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
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.PrincipleAccountablePersonInProgress;
    this.applicationService.updateLocalStorage();
    this.applicationService.updateApplication();
  }

  canContinue(): boolean {
    this.accountablePersonHasErrors = !this.applicationService.model.PrincipalAccountableType;
    return !this.accountablePersonHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let accountablePerson = this.applicationService.startAccountablePersonEdit();
    let route = this.applicationService.model.PrincipalAccountableType == 'organisation' ? 'organisation-type' : PrincipleAccountableSelection.route;

    return navigationService.navigateAppend(`${accountablePerson}/${route}`, activatedRoute);
  }
}
