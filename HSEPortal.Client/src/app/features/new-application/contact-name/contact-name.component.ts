import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';
import { ContactPhoneComponent } from '../contact-phone/contact-phone.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  templateUrl: './contact-name.component.html'
})
export class ContactNameComponent extends PageComponent<ContactNameModel> {
  static route: string = "contact-name";
  static title: string = "Your name - Register a high-rise building - GOV.UK";

  override onInit(applicationService: ApplicationService): void {
    this.model = {
      firstName: applicationService.model.ContactFirstName,
      lastName: applicationService.model.ContactLastName,
    };
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.ContactFirstName = this.model!.firstName;
    applicationService.model.ContactLastName = this.model!.lastName;
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;
  override isValid(): boolean {
    this.firstNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model!.firstName);
    this.lastNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model!.lastName);

    return !this.firstNameInError && !this.lastNameInError;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ContactPhoneComponent.route, this.activatedRoute);
  }

  override canAccess(applicationService: ApplicationService, _: ActivatedRouteSnapshot) {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.BuildingName);
  }
}

class ContactNameModel {
  firstName?: string;
  lastName?: string;
}
