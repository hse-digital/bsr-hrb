import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApplicationService, OutOfScopeReason } from "src/app/services/application.service";
import { SectionPeopleLivingInBuildingComponent } from "../people-living-in-building/people-living-in-building.component";
import { SectionHelper } from "src/app/helpers/section-helper";
import { NotNeedRegisterSingleStructureComponent } from "../not-need-register-single-structure/not-need-register-single-structure.component";
import { NotNeedRegisterMultiStructureComponent } from "../not-need-register-multi-structure/not-need-register-multi-structure.component";
import { ScopeAndDuplicateHelper } from "src/app/helpers/scope-duplicate-helper";
import { PageComponent } from "src/app/helpers/page.component";

@Component({
  templateUrl: './residential-units.component.html'
})
export class SectionResidentialUnitsComponent extends PageComponent<number> {
  static route: string = 'residential-units';
  static title: string = "Number of residential units in the section - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }


  residentialUnitsHasErrors = false;
  errorMessage: string = 'Enter the number of residential units';

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.ResidentialUnits;
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.ResidentialUnits = this.model;
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
    let route: string = SectionPeopleLivingInBuildingComponent.route;
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

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
