import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { LeadDetailsComponent } from "../lead-details/lead-details.component";

@Component({
  templateUrl: './lead-name.component.html'
})
export class LeadNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'lead-name';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.applicationService.currentAccountablePerson.LeadFirstName;
    this.lastNameInError = !this.applicationService.currentAccountablePerson.LeadLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(LeadDetailsComponent.route, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.Role && (this.applicationService.currentAccountablePerson.Role == "employee"
      || (this.applicationService.currentAccountablePerson.Role == "registering_for"
        && (!!this.applicationService.currentAccountablePerson.ActingForAddress || !!this.applicationService.currentAccountablePerson.PapAddress)));
  }

}
