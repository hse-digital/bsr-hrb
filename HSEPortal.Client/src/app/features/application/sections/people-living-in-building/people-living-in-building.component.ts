import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { CaptionService } from "src/app/services/caption.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionYearOfCompletionComponent } from "../year-of-completion/year-of-completion.component";
import { GovukErrorSummaryComponent } from "hse-angular";
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: './people-living-in-building.component.html'
})
export class SectionPeopleLivingInBuildingComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'people-living';
    @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
    static title: string | undefined;

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  peopleLivingHasErrors = false;

  canContinue(): boolean {
    let peopleLivingInBuilding = this.applicationService.currentSection.PeopleLivingInBuilding;
    this.peopleLivingHasErrors = !peopleLivingInBuilding;
    return !this.peopleLivingHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.ResidentialUnits;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(`${SectionYearOfCompletionComponent.route}`, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  getErrorMessage() {
    return `Select if people are living in ${this.sectionBuildingName()}`;
  }
}
