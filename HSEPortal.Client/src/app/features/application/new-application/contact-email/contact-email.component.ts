import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/helpers/base.component';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  templateUrl: './contact-email.component.html'
})
export class ContactEmailComponent extends BaseComponent {
  static route: string = "contact-email";

  constructor(router: Router, public registrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '';
  emailHasErrors = false;

  sendingRequest = false;

  canContinue(): boolean {
    this.emailHasErrors = !this.registrationService.model.ContactEmailAddress;
    return !this.emailHasErrors;
  }
  
  override async saveAndContinue() {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.sendingRequest = true;
      await this.registrationService.registerNewBuildingApplication();
      this.router.navigate(['/building-registration/sections']);
    }
  }

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return !!this.registrationService.model.ContactPhoneNumber;
  }
}
