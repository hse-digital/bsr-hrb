import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';
import { ContactPhoneComponent } from '../contact-phone/contact-phone.component';

export type ContactName = { FirstName: string, LastName: string };

@Component({
  templateUrl: './contact-name.component.html'
})
export class ContactNameComponent extends PageComponent<ContactName> {
  static route: string = "contact-name";
  static title: string = "Your name - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
    this.updateOnSave = false;
  }

  override model: ContactName = { FirstName: "", LastName: "" };
  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.BuildingName);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model.FirstName = applicationService.model.ContactFirstName ?? "";
    this.model.LastName = applicationService.model.ContactLastName ?? "";
  }

  override onSave(applicationService: ApplicationService): void {
    this.applicationService.model.ContactFirstName = this.model?.FirstName;
    this.applicationService.model.ContactLastName = this.model?.LastName;
  }

  override isValid(): boolean {
    this.firstNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model?.FirstName);
    this.lastNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model?.LastName);

    if (!this.firstNameInError && !this.lastNameInError) this.onSave(this.applicationService);

    return !this.firstNameInError && !this.lastNameInError;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ContactPhoneComponent.route, this.activatedRoute);
  }
}
