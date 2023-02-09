import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BlockRegistrationService } from '../../../block-registration.service';

@Injectable({
  providedIn: 'root'
})
export class FloorsAboveGuardService implements CanActivate {

  constructor(private blockRegistrationService: BlockRegistrationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !!this.blockRegistrationService.blockRegistrationModel.blockName;
  }
}
