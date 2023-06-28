import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { ApplicationService, OutOfScopeReason } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-not-need-register-single-structure',
  templateUrl: './not-need-register-single-structure.component.html'
})
export class NotNeedRegisterSingleStructureComponent implements CanActivate {

  static route: string = 'not-need-register-single-structure';
  static title: string = "You do not need to register this building - Register a high-rise building - GOV.UK";

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService) {
    
  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.applicationService.model.NumberOfSections == 'one';
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  OutOfScopeReasonMapper: Record<OutOfScopeReason, string> = {
    [OutOfScopeReason.Height]: this.getHeightReason(),
    [OutOfScopeReason.NumberResidentialUnits]: this.getNumberResidentialUnitsReason(),
    [OutOfScopeReason.PeopleLivingInBuilding]: this.getPeopleLivingInBuildingReason()
  }

  getOutOfScopeReason() {
    return this.OutOfScopeReasonMapper[this.applicationService.currentSection.Scope?.OutOfScopeReason!];
  }

  getHeightReason() {
    let floorsAbove = this.applicationService.currentSection.FloorsAbove!;
    let height = this.applicationService.currentSection.Height!;
    return `You've told us that ${this.sectionBuildingName()} has <b>${floorsAbove} ${floorsAbove > 1 ? 'floors' : 'floor'}</b> and is <b>${height} ${height > 1 ? 'metres' : 'metre'}</b> in height.`;
  }

  getNumberResidentialUnitsReason() {
    let residentialUnits = this.applicationService.currentSection.ResidentialUnits!;
    return `You told us that ${this.sectionBuildingName()} has <b>${residentialUnits} residential ${residentialUnits != 1 ? 'units' : 'unit'}</b>.`;
  }

  getPeopleLivingInBuildingReason() {
    return `You told us that no <b>no one is living in ${this.sectionBuildingName()} and people will not be moving in</b>.`;
  }

  async newApplication() {
    await this.navigationService.navigate('/select');
  }
}
