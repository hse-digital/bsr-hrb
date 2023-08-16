import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './contact-email.component.html',
})
export class ContactEmailComponent extends PageComponent<string>  {

  static route: string = "contact-email";
  static title: string = "Your email address - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactPhoneNumber);
  }
  
  override onInit(applicationService: ApplicationService): void { 
    this.model = applicationService.model.ContactEmailAddress;
  }
  
  emailHasErrors = false;
  override isValid(): boolean {
    this.emailHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model) || !EmailValidator.isValid(this.model ?? "");
    return !this.emailHasErrors;
  }
  
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative('verify', this.activatedRoute);
  }

  override async saveAndUpdate(): Promise<void> {
    await this.onSave();
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.ContactEmailAddress = this.model?.toLowerCase();
    await this.applicationService.sendVerificationEmail(this.applicationService.model.ContactEmailAddress!, "HRB000000000", this.applicationService.model.BuildingName);
  }

}
