import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationService, OutOfScopeReason } from '../services/application.service';

@Pipe({
  name: 'NotNeedRegisterReason'
})
export class NotNeedRegisterReasonPipe implements PipeTransform {

  private applicationService!: ApplicationService;

  private OutOfScopeReasonMapper: Record<OutOfScopeReason, string> = {
    [OutOfScopeReason.Height]: this.getHeightReason(),
    [OutOfScopeReason.NumberResidentialUnits]: this.getNumberResidentialUnitsReason(),
    [OutOfScopeReason.PeopleLivingInBuilding]: this.getPeopleLivingInBuildingReason()
  }

  transform(value: OutOfScopeReason, applicationService: ApplicationService): unknown {
    this.applicationService = applicationService;
    this.getOutOfScopeReason(value);
    return null;
  }

  private getOutOfScopeReason(OutOfScopeReason: OutOfScopeReason) {
    return this.OutOfScopeReasonMapper[OutOfScopeReason];
  }

  private getHeightReason() {
    let floorsAbove = this.applicationService.currentSection.FloorsAbove!;
    let height = this.applicationService.currentSection.Height!;
    return `You've told us that ${this.sectionBuildingName()} has <b>${floorsAbove} ${floorsAbove > 1 ? 'floors' : 'floor'}</b> and is <b>${height} ${height > 1 ? 'metres' : 'metre'}</b> in height.`;
  }

  private getNumberResidentialUnitsReason() {
    let residentialUnits = this.applicationService.currentSection.ResidentialUnits!;
    return `You told us that ${this.sectionBuildingName()} has <b>${residentialUnits} residential ${residentialUnits != 1 ? 'units' : 'unit'}</b>.`;
  }

  private getPeopleLivingInBuildingReason() {
    return `You told us that no <b>no one is living in ${this.sectionBuildingName()} and people will not be moving in</b>.`;
  }

  private sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
