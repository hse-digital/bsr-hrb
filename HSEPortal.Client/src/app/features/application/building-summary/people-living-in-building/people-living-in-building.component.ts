import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApplicationService, OutOfScopeReason } from "src/app/services/application.service";
import { SectionYearOfCompletionComponent } from "../year-of-completion/year-of-completion.component";
import { SectionHelper } from "src/app/helpers/section-helper";
import { NotNeedRegisterSingleStructureComponent } from "../not-need-register-single-structure/not-need-register-single-structure.component";
import { NotNeedRegisterMultiStructureComponent } from "../not-need-register-multi-structure/not-need-register-multi-structure.component";
import { ScopeAndDuplicateHelper } from "src/app/helpers/scope-duplicate-helper";
import { PageComponent } from "src/app/helpers/page.component";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";
import { NeedRemoveWithdrawComponent } from "src/app/features/registration-amendments/change-building-summary/need-remove-withdraw/need-remove-withdraw.component";

@Component({
  templateUrl: './people-living-in-building.component.html'
})
export class SectionPeopleLivingInBuildingComponent extends PageComponent<string> {
  static route: string = 'people-living';
  static title: string = "Are people living in the building? - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
  }


  peopleLivingHasErrors = false;

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.PeopleLivingInBuilding;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.PeopleLivingInBuilding = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.peopleLivingHasErrors = !this.model;
    if(!this.peopleLivingHasErrors) {
      this.IsOutOfScope(this.model!);
    }
    return !this.peopleLivingHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    if (this.applicationService.currentSection.Scope?.IsOutOfScope) {
      
      if (this.changing) return this.navigationService.navigateRelative(`../../registration-amendments/${NeedRemoveWithdrawComponent.route}`, this.activatedRoute);

      return this.applicationService.model.NumberOfSections == 'one' 
        ? this.navigationService.navigateRelative(NotNeedRegisterSingleStructureComponent.route, this.activatedRoute)
        : this.navigationService.navigateRelative(NotNeedRegisterMultiStructureComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(SectionYearOfCompletionComponent.route, this.activatedRoute);
  }

  private IsOutOfScope(peopleLivingInBuilding: string) {
    let wasOutOfScope = this.applicationService.currentSection.Scope?.IsOutOfScope;

    if (!this.peopleLivingHasErrors && peopleLivingInBuilding == 'no_wont_move') {
      this.applicationService.currentSection.Scope = { IsOutOfScope: true, OutOfScopeReason: OutOfScopeReason.PeopleLivingInBuilding };
      if(!this.changing) ScopeAndDuplicateHelper.ClearOutOfScopeSection(this.applicationService);
    } else {
      if (wasOutOfScope) {
        this.returnUrl = undefined;
      }
      
      this.applicationService.currentSection.Scope = { IsOutOfScope: false, OutOfScopeReason: undefined };
    }
  }

  getErrorMessage() {
    return `Select if people are living in ${this.buildingOrSectionName}`;
  }
}
