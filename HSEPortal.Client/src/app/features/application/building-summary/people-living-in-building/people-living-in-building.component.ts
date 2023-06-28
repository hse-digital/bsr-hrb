import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionYearOfCompletionComponent } from "../year-of-completion/year-of-completion.component";
import { GovukErrorSummaryComponent } from "hse-angular";
import { TitleService } from 'src/app/services/title.service';
import { SectionHelper } from "src/app/helpers/section-helper";

@Component({
  templateUrl: './people-living-in-building.component.html'
})
export class SectionPeopleLivingInBuildingComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'people-living';
  static title: string = "Are people living in the building? - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  peopleLivingHasErrors = false;

  canContinue(): boolean {
    let peopleLivingInBuilding = this.applicationService.currentSection.PeopleLivingInBuilding;
    this.peopleLivingHasErrors = !peopleLivingInBuilding;
    return !this.peopleLivingHasErrors;
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currentSection.PeopleLivingInBuilding == 'no_wont_move') {
      return this.applicationService.model.NumberOfSections == 'one' 
        ? navigationService.navigateRelative(SectionPeopleLivingInBuildingComponent.route, activatedRoute)  // user goes to 6258 no need register (single structure)
        : navigationService.navigateRelative(SectionPeopleLivingInBuildingComponent.route, activatedRoute); // user goes to 6259 no need register (multi structure)
    }
    return navigationService.navigateRelative(SectionYearOfCompletionComponent.route, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  getErrorMessage() {
    return `Select if people are living in ${this.sectionBuildingName()}`;
  }
}
