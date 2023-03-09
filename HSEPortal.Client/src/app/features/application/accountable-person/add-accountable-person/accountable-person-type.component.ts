import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from '../../../../helpers/has-next-page.interface';
import { ApNameComponent } from '../ap-name/ap-name.component';
import { OrganisationTypeComponent } from '../organisation/organisation-type/organisation-type.component';

@Component({
  templateUrl: './accountable-person-type.component.html'
})
export class AccountablePersonTypeComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'accountable-person-type';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  otherAccountablePersonHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
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
