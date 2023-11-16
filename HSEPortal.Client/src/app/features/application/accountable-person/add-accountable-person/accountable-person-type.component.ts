import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';
import { ApNameComponent } from '../ap-name/ap-name.component';
import { OrganisationTypeComponent } from '../organisation/organisation-type/organisation-type.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './accountable-person-type.component.html'
})
export class AccountablePersonTypeComponent extends PageComponent<string> {
  static route: string = 'accountable-person-type';
  static title: string = "AP Type - Register a high-rise building - GOV.UK";
  

  
  otherAccountablePersonHasErrors = false;
  
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  previousAnswer?: string;

  override async onSave(): Promise<void> {
    this.applicationService.currentAccountablePerson.Type = this.model;
    let newAnswer = this.applicationService.currentAccountablePerson.Type;
    if (this.previousAnswer && this.previousAnswer != newAnswer) {
      this.returnUrl = undefined;
      this.applicationService.currentVersion.AccountablePersons[this.applicationService._currentAccountablePersonIndex] = new AccountablePersonModel();
      this.applicationService.currentAccountablePerson.Type = newAnswer;
    }
  }

  override onInit(applicationService: ApplicationService): void {
    this.previousAnswer = this.applicationService.currentAccountablePerson.Type;
    this.model = this.applicationService.currentAccountablePerson.Type;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService) && this.applicationService._currentAccountablePersonIndex > 0;
  }

  override isValid(): boolean {
    this.otherAccountablePersonHasErrors = !this.model;
    return !this.otherAccountablePersonHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    let route = this.applicationService.currentAccountablePerson.Type == 'organisation' ? OrganisationTypeComponent.route : ApNameComponent.route;
    return this.navigationService.navigateRelative(route, this.activatedRoute);
  }
}