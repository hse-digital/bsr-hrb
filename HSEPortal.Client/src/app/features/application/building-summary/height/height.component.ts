import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService, OutOfScopeReason } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { SectionResidentialUnitsComponent } from "../residential-units/residential-units.component";
import { NotNeedRegisterSingleStructureComponent } from "../not-need-register-single-structure/not-need-register-single-structure.component";
import { NotNeedRegisterMultiStructureComponent } from "../not-need-register-multi-structure/not-need-register-multi-structure.component";
import { ScopeAndDuplicateHelper } from "src/app/helpers/scope-duplicate-helper";

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
      this.IsOutOfScope(height);
    }

    return !this.heightHasErrors;
  }

  private IsOutOfScope(height: number) {
    let wasOutOfScope = this.applicationService.currentSection.Scope?.IsOutOfScope;

    if (height < 18 && this.applicationService.currentSection.FloorsAbove! < 7) {
      this.applicationService.currentSection.Scope = { IsOutOfScope: true, OutOfScopeReason: OutOfScopeReason.Height };
      ScopeAndDuplicateHelper.ClearOutOfScopeSection(this.applicationService,);
    } else {
      if (wasOutOfScope) {
        this.returnUrl = undefined;
      }

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
    return navigationService.navigateRelative(SectionResidentialUnitsComponent.route, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
