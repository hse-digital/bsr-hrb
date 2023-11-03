import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApplicationService, OutOfScopeReason } from "src/app/services/application.service";
import { SectionHelper } from "src/app/helpers/section-helper";
import { NotNeedRegisterSingleStructureComponent } from "../not-need-register-single-structure/not-need-register-single-structure.component";
import { NotNeedRegisterMultiStructureComponent } from "../not-need-register-multi-structure/not-need-register-multi-structure.component";
import { ScopeAndDuplicateHelper } from "src/app/helpers/scope-duplicate-helper";
import { PageComponent } from "src/app/helpers/page.component";
import { SectionYearOfCompletionComponent } from "../year-of-completion/year-of-completion.component";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";
import { NeedRemoveWithdrawComponent } from "src/app/features/registration-amendments/change-building-summary/need-remove-withdraw/need-remove-withdraw.component";

@Component({
  templateUrl: './residential-units.component.html'
})
export class SectionResidentialUnitsComponent extends PageComponent<number> {
  static route: string = 'residential-units';
  static title: string = "Number of residential units in the section - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
    this.isPageChangingBuildingSummary(SectionResidentialUnitsComponent.route);
  }

  residentialUnitsHasErrors = false;
  errorMessage: string = 'Enter the number of residential units';

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.ResidentialUnits;
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.ResidentialUnits = this.model;
  }

  override onInitChange(applicationService: ApplicationService): void | Promise<void> {
    if (!this.applicationService.currentChangedSection.SectionModel?.ResidentialUnits) this.onInit(this.applicationService);
    else this.model = this.applicationService.currentChangedSection.SectionModel?.ResidentialUnits;
  }

  override onChange(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.currentChangedSection!.SectionModel!.ResidentialUnits = this.model;
  }
  
  override nextChangeRoute(): string {
    let section = new ChangeBuildingSummaryHelper(this.applicationService).getSections()[this.applicationService._currentSectionIndex];
    if (section.ResidentialUnits! < 2) {
      this.initScope();
      this.applicationService.currentChangedSection.SectionModel!.Scope!.IsOutOfScope = true;
      this.applicationService.currentChangedSection.SectionModel!.Scope!.OutOfScopeReason = OutOfScopeReason.NumberResidentialUnits;
      return `../../registration-amendments/${NeedRemoveWithdrawComponent.route}`;
    }
    return this.buildingSummaryNavigation.getNextChangeRoute(section); 
  }

  private initScope() {
    if (!this.applicationService.currentChangedSection.SectionModel!.Scope) {
      this.applicationService.currentChangedSection.SectionModel!.Scope = {};
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }
  
  override isValid(): boolean {
    this.residentialUnitsHasErrors = true;
    let residentialUnits = this.model;

    if (!residentialUnits) {
      this.errorMessage = 'Enter the number of residential units';
    } else if (!Number.isInteger(Number(residentialUnits)) || Number(residentialUnits) % 1 != 0 || Number(residentialUnits) < 0) {
      this.errorMessage = this.errorMessage = 'Number of residential units must be a whole number';
    } else if (residentialUnits >= 10000) {
      this.errorMessage = this.errorMessage = 'Number of residential units must be 9999 or less';
    } else {
      this.residentialUnitsHasErrors = false;
      this.IsOutOfScope(residentialUnits);
    }
    return !this.residentialUnitsHasErrors;
  }
  
  override navigateNext(): Promise<boolean> {
    let route: string = SectionYearOfCompletionComponent.route;
    if (this.applicationService.currentSection.Scope?.IsOutOfScope) {
      route = this.applicationService.model.NumberOfSections == 'one' 
        ? NotNeedRegisterSingleStructureComponent.route
        : NotNeedRegisterMultiStructureComponent.route;
    }
    return this.navigationService.navigateRelative(route, this.activatedRoute);
  }

  private IsOutOfScope(residentialUnits: number) {
    let wasOutOfScope = this.applicationService.currentSection.Scope?.IsOutOfScope;

    if (residentialUnits < 2) {
      this.applicationService.currentSection.Scope = { IsOutOfScope: true, OutOfScopeReason: OutOfScopeReason.NumberResidentialUnits };
      ScopeAndDuplicateHelper.ClearOutOfScopeSection(this.applicationService, false, true);
    } else {
      if (wasOutOfScope) {
        this.returnUrl = undefined;
      }

      this.applicationService.currentSection.Scope = { IsOutOfScope: false, OutOfScopeReason: undefined };
    }
  }

}
