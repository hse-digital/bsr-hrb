import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: 'out-of-scope.component.html'
})
export class BuildingOutOfScopeComponent extends BaseComponent {
  static route: string = 'out-of-scope';
  static title: string = "You do not need to register this building - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    return true;
  }

  async registerAnother() {
    this.applicationService.clearApplication();
    await this.navigationService.navigate('select');
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    let outOfScope = this.applicationService.model.Sections.filter(section => SectionHelper.isOutOfScope(section));
    return outOfScope.length == this.applicationService.model.Sections.length;
  }
}
