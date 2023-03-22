import { Component, QueryList, ViewChildren } from "@angular/core";
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { SectionHelper } from "src/app/helpers/section-helper";

@Component({
  templateUrl: './intro.component.html'
})
export class SectionsIntroComponent extends BaseComponent implements IHasNextPage {
  static route: string = '';
  static title: string = "Required section information - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService)
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateAppend('name', activatedRoute);
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService) && 
      this.applicationService.model.NumberOfSections === "two_or_more";
  }

}
