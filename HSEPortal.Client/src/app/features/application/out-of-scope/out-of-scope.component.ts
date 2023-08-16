import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from "src/app/helpers/page.component";
import { ScopeAndDuplicateHelper } from "src/app/helpers/scope-duplicate-helper";
import { ApplicationService, OutOfScopeReason, Scope, SectionModel } from "src/app/services/application.service";

@Component({
  templateUrl: 'out-of-scope.component.html'
})
export class BuildingOutOfScopeComponent extends PageComponent<void> {
  static route: string = 'out-of-scope';
  static title: string = "You do not need to register this building - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void { }
  
  override async onSave(applicationService: ApplicationService): Promise<void> { }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ScopeAndDuplicateHelper.AreAllSectionsOutOfScope(this.applicationService);
  }
  
  override isValid(): boolean {
    return true;
  }
  
  override async navigateNext(): Promise<void> { }

  async registerAnother() {
    this.applicationService.clearApplication();
    await this.navigationService.navigate('select');
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
