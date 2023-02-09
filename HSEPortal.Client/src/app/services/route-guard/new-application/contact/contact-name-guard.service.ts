import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { BuildingRegistrationService } from '../../../building-registration.service';

@Injectable({
  providedIn: 'root'
})
export class ContactNameGuardService implements CanActivate {

  constructor(private registrationService: BuildingRegistrationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log(this.registrationService.model);
    return !!this.registrationService.model.BuildingName;
  }
}
