import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { ContinueAnywayComponent } from "./continue-anyway.component";

@Component({
  templateUrl: 'out-of-scope.component.html'
})
export class BuildingOutOfScopeComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'out-of-scope';
  static title: string = "You do not need to register this building - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(ContinueAnywayComponent.route, activatedRoute);
  }

  async registerAnother() {
    this.applicationService.clearApplication();
    await this.navigationService.navigate('');
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    let outOfScope = this.applicationService.model.Sections.filter(section => SectionHelper.isOutOfScope(section));
    return outOfScope.length == this.applicationService.model.Sections.length;
  }
}
