import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { BuildingRegistrationService } from '../../../building-registration.service';

@Injectable({
  providedIn: 'root'
})
export class ContactPhoneGuardService implements CanActivate {

  constructor(private registrationService: BuildingRegistrationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let hasFirstName: boolean = !!this.registrationService.model.ContactFirstName;
    let hasLastName: boolean = !!this.registrationService.model.ContactLastName;

    return hasFirstName && hasLastName;
  }
}
