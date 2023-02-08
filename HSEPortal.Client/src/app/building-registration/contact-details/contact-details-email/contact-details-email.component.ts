import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from '../../../services/building-registration/building-registration.service';

@Component({
  templateUrl: './contact-details-email.component.html'
})
export class ContactDetailsEmailComponent extends BaseFormComponent {

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
}
