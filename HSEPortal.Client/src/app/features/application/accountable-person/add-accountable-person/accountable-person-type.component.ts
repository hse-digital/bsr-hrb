import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ApNameComponent } from '../ap-name/ap-name.component';
import { OrganisationTypeComponent } from '../organisation/organisation-type/organisation-type.component';

@Component({
  templateUrl: './accountable-person-type.component.html'
})
export class AccountablePersonTypeComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'accountable-person-type';
  static title: string = "AP Type - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  otherAccountablePersonHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
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

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService) && this.applicationService._currentAccountablePersonIndex > 0;
  }
}
