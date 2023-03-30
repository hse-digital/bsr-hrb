import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { OrganisationNameComponent } from '../organisation-name/organisation-name.component';

@Component({
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent extends BaseComponent implements IHasNextPage, AfterViewInit {
  static route: string = 'organisation-type';

  static title: string = "What is the PAP Organisation Type? - Register a high-rise building - GOV.UK";
  static apTitle: string = "AP Organisation Type - Register a high-rise building - GOV.UK";

  organisationTypeHasErrors = false;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngAfterViewInit() {
    if (this.applicationService._currentAccountablePersonIndex > 0) {
      this.titleService.setTitle(OrganisationTypeComponent.apTitle);
    }
  }

  canContinue(): boolean {
    this.organisationTypeHasErrors = !this.applicationService.currentAccountablePerson.OrganisationType;
    return !this.organisationTypeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(OrganisationNameComponent.route, activatedRoute);
  }

  getPrincipalOrOther() {
    return !this.isPrincipal() ? 'Other' : 'Principal';
  }

  title() {
    return `${this.isPrincipal() ? 'Principal' : 'Other'} accountable person for ${this.applicationService.model.BuildingName}`;
  }

  isPrincipal() {
    return this.applicationService._currentAccountablePersonIndex == 0;
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(this.applicationService);
  }
}
