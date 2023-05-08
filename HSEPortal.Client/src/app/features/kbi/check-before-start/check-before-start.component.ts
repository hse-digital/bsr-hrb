import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-check-before-start',
  templateUrl: './check-before-start.component.html'
})
export class CheckBeforeStartComponent implements CanActivate {
  public static route: string = "check-before-start";
  static title: string = "Check before start - KBI - Register a high-rise building - GOV.UK";

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute){
    
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }

  continue(){
    return this.navigationService.navigateRelative(CheckBeforeStartComponent.route, this.activatedRoute);
  }
}
