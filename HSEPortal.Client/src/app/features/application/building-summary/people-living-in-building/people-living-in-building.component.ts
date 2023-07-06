import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService, OutOfScopeReason } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionYearOfCompletionComponent } from "../year-of-completion/year-of-completion.component";
import { GovukErrorSummaryComponent } from "hse-angular";
import { TitleService } from 'src/app/services/title.service';
import { SectionHelper } from "src/app/helpers/section-helper";
import { NotNeedRegisterSingleStructureComponent } from "../not-need-register-single-structure/not-need-register-single-structure.component";
import { NotNeedRegisterMultiStructureComponent } from "../not-need-register-multi-structure/not-need-register-multi-structure.component";

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
    this.IsOutOfScope(peopleLivingInBuilding);
    return !this.peopleLivingHasErrors;
  }

  private IsOutOfScope(peopleLivingInBuilding: string) {
    if (!this.peopleLivingHasErrors && peopleLivingInBuilding == 'no_wont_move') {
      this.applicationService.currentSection.Scope = { IsOutOfScope: true, OutOfScopeReason: OutOfScopeReason.PeopleLivingInBuilding };
    } else {
      this.applicationService.currentSection.Scope = { IsOutOfScope: false, OutOfScopeReason: undefined };
    }
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currentSection.Scope?.IsOutOfScope) {
      return this.applicationService.model.NumberOfSections == 'one' 
        ? navigationService.navigateRelative(NotNeedRegisterSingleStructureComponent.route, activatedRoute)
        : navigationService.navigateRelative(NotNeedRegisterMultiStructureComponent.route, activatedRoute);
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
