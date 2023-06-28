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

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService) {
    
  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.applicationService.model.NumberOfSections == 'one';
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }  

  async newApplication() {
    await this.navigationService.navigate('/select');
  }
}
