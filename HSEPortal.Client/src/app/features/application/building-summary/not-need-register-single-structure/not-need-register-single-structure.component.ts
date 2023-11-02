import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, OutOfScopeReason } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-not-need-register-single-structure',
  templateUrl: './not-need-register-single-structure.component.html'
})
export class NotNeedRegisterSingleStructureComponent implements CanActivate {

  static route: string = 'not-need-register-single-structure';
  static title: string = "You do not need to register this building - Register a high-rise building - GOV.UK";

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService) {

  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.applicationService.model.NumberOfSections == 'one';
  }

  sectionBuildingName(): string {
    let newName = this.applicationService.currentChangedSection?.SectionModel?.Name;
    let sectionName = FieldValidations.IsNotNullOrWhitespace(newName) ? newName : this.applicationService.currentSection.Name; 
    return this.applicationService.model.NumberOfSections == "one" ? this.applicationService.model.BuildingName! : sectionName!;
  }

  async newApplication() {
    await this.navigationService.navigate('/select');
  }

  private OutOfScopeClarification: Record<OutOfScopeReason, string> = {
    [OutOfScopeReason.Height]: "You only need to register a high-rise residential building if it has at least 7 floors or is at least 18 metres in height",
    [OutOfScopeReason.NumberResidentialUnits]: "You only need to register a high-rise building if it has at least 2 residential units",
    [OutOfScopeReason.PeopleLivingInBuilding]: "You can only register a high-rise building if you plan to allow residents to occupy it"
  }

  getClarification() {
    if (!!this.applicationService.currentSection.Scope) 
      return this.OutOfScopeClarification[this.applicationService.currentSection.Scope?.OutOfScopeReason!];
    return "";
  }
}
