import { Component, QueryList, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrganisationNameComponent } from '../organisation-name/organisation-name.component';

@Component({
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'organisation-type';
  organisationTypeHasErrors = false;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: Title) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    this.organisationTypeHasErrors = !this.applicationService.currentAccountablePerson.OrganisationType;
    return !this.organisationTypeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(OrganisationNameComponent.route, activatedRoute);
  }

  getPrincipalOrOther() {
    return this.applicationService._currentAccountablePersonIndex > 0 ? 'Other' : 'Principal';
  }

  title() {
    return `${this.applicationService._currentAccountablePersonIndex == 0 ? 'Principal' : 'Other'} accountable person for ${this.applicationService.model.BuildingName}`;
  }
}
