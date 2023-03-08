import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { CaptionService } from "src/app/services/caption.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "../../../../helpers/has-next-page.interface";

@Component({
  templateUrl: './height.component.html',
})
export class SectionHeightComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'height';
  override updateOnSave: boolean = true;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  heightHasErrors = false;

  errorSummaryMessage: string = 'You must enter the height of this block from ground level to the top floor in metres';
  errorMessage: string = 'Enter the block height in metres';

  canContinue(): boolean {
    this.heightHasErrors = true;
    let height = this.applicationService.currentSection.Height;

    if (!height || !Number(height)) {
      this.errorMessage = 'Enter the block height in metres';
      this.errorSummaryMessage = 'You must enter the height of this block from ground level to the top floor in metres';
    } else if (height >= 1000) {
      this.errorSummaryMessage = this.errorMessage = 'Block height in metres must be 999.9 or less';
    } else if (height < 3) {
      this.errorSummaryMessage = this.errorMessage = 'Block height in metres must be more than 2';
    } else {
      this.heightHasErrors = false;
    }

    return !this.heightHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.FloorsAbove;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('residential-units', activatedRoute);
  }
}
