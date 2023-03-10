import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from '../../../../helpers/has-next-page.interface';
import { ApNameComponent } from '../ap-name/ap-name.component';
import { OrganisationTypeComponent } from '../organisation/organisation-type/organisation-type.component';

@Component({
  templateUrl: './accountable-person-type.component.html'
})
export class AccountablePersonTypeComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'accountable-person-type';

  otherAccountablePersonHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  previousAnswer?: string;
  ngOnInit(): void {
    this.previousAnswer = this.applicationService.currentAccountablePerson.Type;
  }

  override async onSave(): Promise<void> {
    let newAnswer = this.applicationService.currentAccountablePerson.Type;
    if (this.previousAnswer && this.previousAnswer != newAnswer) {
      this.returnUrl = undefined;
      this.applicationService.model.AccountablePersons[this.applicationService._currentAccountablePersonIndex] = new AccountablePersonModel();
      this.applicationService.currentAccountablePerson.Type = newAnswer;
    }
  }

  canContinue(): boolean {
    this.otherAccountablePersonHasErrors = !this.applicationService.currentAccountablePerson.Type;
    return !this.otherAccountablePersonHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let route = this.applicationService.currentAccountablePerson.Type == 'organisation' ? OrganisationTypeComponent.route : ApNameComponent.route;
    return navigationService.navigateRelative(route, activatedRoute);
  }
}
