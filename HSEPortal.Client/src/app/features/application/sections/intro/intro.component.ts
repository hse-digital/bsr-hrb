import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  templateUrl: './intro.component.html'
})
export class SectionsIntroComponent extends BaseComponent implements IHasNextPage {
  static route: string = '';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute)
  }


  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateAppend('name', activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.model.NumberOfSections && this.applicationService.model.NumberOfSections === "two_or_more";
  }

}
