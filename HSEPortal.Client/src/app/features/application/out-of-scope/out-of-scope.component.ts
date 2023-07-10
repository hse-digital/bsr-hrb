import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { ScopeAndDuplicateHelper } from "src/app/helpers/scope-duplicate-helper";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService, OutOfScopeReason, Scope, SectionModel } from "src/app/services/application.service";
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

  override canAccess(_: ActivatedRouteSnapshot) {
    return ScopeAndDuplicateHelper.AreAllSectionsOutOfScope(this.applicationService);
  }

  getOutOfScopeReason(section: SectionModel) {
    switch(section.Scope!.OutOfScopeReason) {
      case OutOfScopeReason.Height: return `${section.Name} has less than 7 floors and is less than 18 metres in height`;
      case OutOfScopeReason.NumberResidentialUnits: return `${section.Name} has less than 2 residential units`;
      case OutOfScopeReason.PeopleLivingInBuilding: return `${section.Name} has no one living in it and no one will be moving in`;
    }
    return "";
  }

  showHeightReason(scope: Scope) {
    return scope.OutOfScopeReason == OutOfScopeReason.Height;
  }

  showNumberResidentialUnitsReason(scope: Scope) {
    return scope.OutOfScopeReason == OutOfScopeReason.NumberResidentialUnits;
  }

  showPeopleLivingInBuildingReason(scope: Scope) {
    return scope.OutOfScopeReason == OutOfScopeReason.PeopleLivingInBuilding;
  }
}
