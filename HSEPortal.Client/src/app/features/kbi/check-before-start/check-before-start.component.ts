import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplicationService, KbiModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

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
    this.applicationService.model.Kbi = new KbiModel();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }

  continue(){
    return this.navigationService.navigateRelative(CheckBeforeStartComponent.route, this.activatedRoute);
  }
}
