import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApplicationService, OutOfScopeReason } from "src/app/services/application.service";
import { SectionHelper } from "src/app/helpers/section-helper";
import { PageComponent } from "src/app/helpers/page.component";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";
import { NeedRemoveWithdrawComponent } from "src/app/features/registration-amendments/change-building-summary/need-remove-withdraw/need-remove-withdraw.component";

@Component({
  templateUrl: './floors-above.component.html'
})
export class SectionFloorsAboveComponent extends PageComponent<number> {
  static route: string = 'floors';
  static title: string = "Number of floors at or above ground level in the section - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
    this.isPageChangingBuildingSummary(SectionFloorsAboveComponent.route);
  }

  errorMessage: string = 'Enter the number of floors at or above ground level';

  floorsHasError = false;

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.FloorsAbove;
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.FloorsAbove = this.model;
  }

  override onInitChange(applicationService: ApplicationService): void | Promise<void> {
    if (!this.applicationService.currentChangedSection.SectionModel?.FloorsAbove) this.onInit(this.applicationService);
    else this.model = this.applicationService.currentChangedSection.SectionModel?.FloorsAbove;
  }

  override onChange(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.currentChangedSection!.SectionModel!.FloorsAbove = this.model;
  }

  override nextChangeRoute(): string {
    let section = new ChangeBuildingSummaryHelper(this.applicationService).getSections()[this.applicationService._currentSectionIndex];
    if (section.Height! < 18 && section.FloorsAbove! < 7) {
      this.initScope();
      this.applicationService.currentChangedSection.SectionModel!.Scope!.IsOutOfScope = true;
      this.applicationService.currentChangedSection.SectionModel!.Scope!.OutOfScopeReason = OutOfScopeReason.Height;
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
    this.floorsHasError = true;
    let floorsAbove = this.model;

    if (!floorsAbove || !Number(floorsAbove) || floorsAbove % 1 != 0) {
      this.errorMessage = 'Enter the number of floors at or above ground level';
    } else if (floorsAbove >= 1000) {
      this.errorMessage = 'Enter a whole number below 999';
    } else if (floorsAbove < 1) {
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.floorsHasError = false;
    }

    return !this.floorsHasError;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative('height', this.activatedRoute);
  }

}
