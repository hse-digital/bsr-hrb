import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { BlockRegistrationService } from '../../../block-registration.service';

@Injectable({
  providedIn: 'root'
})
export class HeightGuardService implements CanActivate {

  constructor(private blockRegistrationService: BlockRegistrationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !!this.blockRegistrationService.blockRegistrationModel.floorsAbove;
  }
}

