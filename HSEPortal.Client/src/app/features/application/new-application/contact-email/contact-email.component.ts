import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  templateUrl: './contact-email.component.html'
})
export class ContactEmailComponent extends BaseComponent {
  static route: string = "contact-email";

  constructor(router: Router, applicationService: ApplicationService) {
    super(router, applicationService);
  }

  nextScreenRoute: string = '';
  emailHasErrors = false;

  sendingRequest = false;

  canContinue(): boolean {
    this.emailHasErrors = !this.applicationService.model.ContactEmailAddress || !this.isEmailValid();
    return !this.emailHasErrors;
  }

  override async saveAndContinue() {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.sendingRequest = true;
      await this.applicationService.registerNewBuildingApplication();
      this.router.navigate(['/building-registration/sections']);
    }
  }

  private isEmailValid(): boolean {
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    return emailRegex.test(this.applicationService.model.ContactEmailAddress ?? '');
  }

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return !!this.applicationService.model.ContactPhoneNumber;
  }
}
