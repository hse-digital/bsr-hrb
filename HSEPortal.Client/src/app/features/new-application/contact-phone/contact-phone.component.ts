import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { PhoneNumberValidator } from 'src/app/helpers/validators/phone-number-validator';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';
import { ContactEmailComponent } from '../contact-email/contact-email.component';

@Component({
  templateUrl: './contact-phone.component.html'
})
export class ContactPhoneComponent extends PageComponent<string> {

  static route: string = "contact-phone";
  static title: string = "Your telephone number - Register a high-rise building - GOV.UK";

  override model: string = "";
  
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
    this.updateOnSave = false;
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.ContactPhoneNumber ?? "";
  }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let hasFirstName = FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactFirstName);
    let hasLastName = FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactLastName);

    return hasFirstName && hasLastName;
  }
  
  override onSave(applicationService: ApplicationService): void {
    this.applicationService.model.ContactPhoneNumber = this.model;
  }

  phoneNumberHasErrors = false;
  override isValid(): boolean {
    this.phoneNumberHasErrors = !PhoneNumberValidator.isValid(this.model);
    if(!this.phoneNumberHasErrors) this.onSave(this.applicationService);
    return !this.phoneNumberHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ContactEmailComponent.route, this.activatedRoute);
  }

}
