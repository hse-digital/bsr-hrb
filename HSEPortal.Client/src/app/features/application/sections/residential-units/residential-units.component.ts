import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionPeopleLivingInBuildingComponent } from "../people-living-in-building/people-living-in-building.component";
import { SectionYearOfCompletionComponent } from "../year-of-completion/year-of-completion.component";
import { GovukErrorSummaryComponent } from "hse-angular";
import { TitleService } from 'src/app/services/title.service';
import { SectionHelper } from "src/app/helpers/section-name-helper";

@Component({
  templateUrl: './residential-units.component.html'
})
export class SectionResidentialUnitsComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'residential-units';
  static title: string = "Number of residential units in the section - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  residentialUnitsHasErrors = false;

  errorMessage: string = 'Enter the number of residential units';

  canContinue(): boolean {
    this.residentialUnitsHasErrors = true;
    let residentialUnits = this.applicationService.currentSection.ResidentialUnits;

    if (!residentialUnits) {
      this.errorMessage = 'Enter the number of residential units';
    } else if (!Number.isInteger(Number(residentialUnits)) || Number(residentialUnits) % 1 != 0 || Number(residentialUnits) < 0) {
      this.errorMessage = this.errorMessage = 'Number of residential units must be a whole number';
    } else if (residentialUnits >= 10000) {
      this.errorMessage = this.errorMessage = 'Number of residential units must be 9999 or less';
    } else {
      this.residentialUnitsHasErrors = false;
    }
    return !this.residentialUnitsHasErrors;
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let route: string = '';
    if (this.applicationService.currentSection.ResidentialUnits == 0) {
      route = SectionYearOfCompletionComponent.route;
    } else {
      route = SectionPeopleLivingInBuildingComponent.route;
    }

    return navigationService.navigateRelative(route, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
