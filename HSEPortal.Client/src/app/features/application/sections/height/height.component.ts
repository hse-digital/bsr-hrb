import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: './height.component.html',
})
export class SectionHeightComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'height';
  static title: string = "What is the section height - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  heightHasErrors = false;

  errorMessage: string = 'Enter the height in metres';

  canContinue(): boolean {
    this.heightHasErrors = true;
    let height = this.applicationService.currentSection.Height;

    if (!height || !Number(height)) {
      this.errorMessage = 'Enter the height in metres';
    } else if (height >= 1000) {
      this.errorMessage = this.errorMessage = 'Height in metres must be 999.9 or less';
    } else if (height < 3) {
      this.errorMessage = this.errorMessage = 'Height in metres must be more than 2';
    } else {
      this.heightHasErrors = false;
    }

    return !this.heightHasErrors;
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('residential-units', activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
