import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';

@Component({
  selector: 'hse-accountable-person',
  templateUrl: './accountable-person.component.html'
})
export class AccountablePersonComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = '';

  accountablePersonHasErrors = false;
  accountablePersonType?: string;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }
  
  ngOnInit(): void {
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.PrincipleAccountablePersonInProgress;
  }

  canContinue(): boolean {
    this.accountablePersonHasErrors = !this.accountablePersonType;
    return !this.accountablePersonHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let accountablePerson = this.applicationService.startAccountablePersonEdit(this.accountablePersonType!);
    let route = this.accountablePersonType == 'organisation' ? 'organisation-type' : 'individual-name';

    return navigationService.navigateRelative(`accountable-person/${accountablePerson}/${route}`, activatedRoute);
  }
}
