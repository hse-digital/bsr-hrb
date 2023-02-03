import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from '../../../services/building-registration/building-registration.service';

@Component({
  templateUrl: './contact-details-email.component.html'
})
export class ContactDetailsEmailComponent extends BaseFormComponent {

  constructor(router: Router, private buildingRegistrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '';
  contactDetails: { email?: string } = {};
  emailHasErrors = false;

  sendingRequest = false;

  canContinue(): boolean {
    this.emailHasErrors = !this.contactDetails.email;
    return !this.emailHasErrors;
  }

  updateContactEmailAddress(contactEmailAddress: string) {
    this.buildingRegistrationService.setContactEmailAddress(contactEmailAddress);
  }

  override async saveAndContinue() {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.sendingRequest = true;
      await this.buildingRegistrationService.registerNewBuildingApplication();
      this.router.navigate(['/building-registration/sections']);
    }
  }
}
