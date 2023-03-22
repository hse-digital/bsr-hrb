import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { GovukErrorSummaryComponent } from "hse-angular";
import { TitleService } from 'src/app/services/title.service';
import { SectionHelper } from "src/app/helpers/section-helper";

@Component({
  templateUrl: './floors-above.component.html'
})
export class SectionFloorsAboveComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'floors';
  static title: string = "Number of floors at or above ground level in the section - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  floorsHasError = false;

  errorMessage: string = 'Enter the number of floors at or above ground level';
  canContinue(): boolean {
    this.floorsHasError = true;
    let floorsAbove = this.applicationService.currentSection.FloorsAbove;

    if (!floorsAbove || !Number(floorsAbove) || floorsAbove % 1 != 0) {
      this.errorMessage = 'Enter the number of floors at or above ground level';
    } else if (floorsAbove >= 1000) {
      this.errorMessage = 'Enter a whole number below 999';
    } else if (floorsAbove < 1) {
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.floorsHasError = false;
    }

    return !this.floorsHasError;
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('height', activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
