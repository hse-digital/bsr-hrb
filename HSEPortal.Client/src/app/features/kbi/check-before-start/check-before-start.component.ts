import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStatus, KbiModel, KbiSectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { EvacuationStrategyComponent } from '../evacuation-strategy/evacuation-strategy.component';

@Component({
  selector: 'hse-check-before-start',
  templateUrl: './check-before-start.component.html'
})
export class CheckBeforeStartComponent implements CanActivate, OnInit {
  public static route: string = "check-before-start";
  static title: string = "Check before start - KBI - Register a high-rise building - GOV.UK";

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute){
    
  }

  ngOnInit(): void {
    if(!this.applicationService.model.Kbi) {
      this.applicationService.model.Kbi = new KbiModel();
      this.applicationService.model.Sections.forEach(x => this.applicationService.model.Kbi!.KbiSections.push(new KbiSectionModel()));
      this.applicationService._currentSectionIndex = 0;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }

  continue(){
    return this.navigationService.navigateRelative(EvacuationStrategyComponent.route, this.activatedRoute);
  }
}
