import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
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
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiCheckBeforeInProgress;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
    // return (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete;
  }

  continue(){
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiCheckBeforeComplete;
    return this.navigationService.navigateRelative(EvacuationStrategyComponent.route, this.activatedRoute);
  }
}
