import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { SectionAddressComponent } from "../address/address.component";

@Component({
  templateUrl: './year-range.component.html'
})
export class SectionYearRangeComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'year-range';

  yearRangeHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.yearRangeHasErrors = !this.applicationService.currentSection.YearOfCompletionRange;
    return !this.yearRangeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionAddressComponent.route, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.YearOfCompletionOption && this.applicationService.currentSection.YearOfCompletionOption == "year-not-exact";
  }

}
