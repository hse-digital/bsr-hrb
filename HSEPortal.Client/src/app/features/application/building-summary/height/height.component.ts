import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService, OutOfScopeReason } from "src/app/services/application.service";
import { SectionResidentialUnitsComponent } from "../residential-units/residential-units.component";
import { NotNeedRegisterSingleStructureComponent } from "../not-need-register-single-structure/not-need-register-single-structure.component";
import { NotNeedRegisterMultiStructureComponent } from "../not-need-register-multi-structure/not-need-register-multi-structure.component";
import { ScopeAndDuplicateHelper } from "src/app/helpers/scope-duplicate-helper";
import { PageComponent } from "src/app/helpers/page.component";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";
import { NeedRemoveWithdrawComponent } from "src/app/features/registration-amendments/change-building-summary/need-remove-withdraw/need-remove-withdraw.component";

@Component({
  templateUrl: './height.component.html',
})
export class SectionHeightComponent extends PageComponent<number> {
  static route: string = 'height';
  static title: string = "What is the section height - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
  }

  heightHasErrors = false;
  errorMessage: string = 'Enter the height in metres';

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.Height;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.Height = this.model;
  }

  override nextChangeRoute(): string {
    let section = new ChangeBuildingSummaryHelper(this.applicationService).getSections()[this.applicationService._currentSectionIndex];
    if (section.Height! < 18 && section.FloorsAbove! < 7) {
      this.initScope();
      this.applicationService.currentSection.Scope!.IsOutOfScope = true;
      this.applicationService.currentSection.Scope!.OutOfScopeReason = OutOfScopeReason.Height;
      return `../../registration-amendments/${NeedRemoveWithdrawComponent.route}`;
    }
    return this.buildingSummaryNavigation.getNextChangeRoute(section);
  }

  private initScope() {
    if (!this.applicationService.currentSection.Scope) {
      this.applicationService.currentSection.Scope = {};
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.heightHasErrors = true;
    let height = this.model;

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

  override navigateNext(): Promise<boolean> {
    if (this.applicationService.currentSection.Scope?.IsOutOfScope) {
      return this.applicationService.model.NumberOfSections == 'one'
        ? this.navigationService.navigateRelative(NotNeedRegisterSingleStructureComponent.route, this.activatedRoute)
        : this.navigationService.navigateRelative(NotNeedRegisterMultiStructureComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(SectionResidentialUnitsComponent.route, this.activatedRoute);
  }

  private IsOutOfScope(height: number) {
    let wasOutOfScope = this.applicationService.currentSection.Scope?.IsOutOfScope;

    if (height < 18 && this.applicationService.currentSection.FloorsAbove! < 7) {
      this.applicationService.currentSection.Scope = { IsOutOfScope: true, OutOfScopeReason: OutOfScopeReason.Height };
      if(!this.changing) ScopeAndDuplicateHelper.ClearOutOfScopeSection(this.applicationService,);
    } else {
      if (wasOutOfScope) {
        this.returnUrl = undefined;
      }

      this.applicationService.currentSection.Scope = { IsOutOfScope: false, OutOfScopeReason: undefined };
    }
  }

}
