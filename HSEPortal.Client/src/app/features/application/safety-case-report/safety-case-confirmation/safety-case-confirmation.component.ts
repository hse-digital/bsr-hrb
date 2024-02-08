import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, } from 'src/app/services/application.service';

@Component({
  selector: 'hse-safety-case-confirmation',
  templateUrl: './safety-case-confirmation.component.html',
})
export class SafetyCaseConfirmationComponent extends PageComponent<void>  {
  static route: string = "confirmation";
  static title: string = "Safety case confirmation - Register a high-rise building - GOV.UK";
  applicationReference?: string;
  buildingName?: string;
  userEmail?: string;
  pncEmail?: string;
  showPncEmail: boolean = false;
  shouldRender = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.applicationReference = applicationService.model.id;
    this.buildingName = applicationService.model.BuildingName;
    this.userEmail = applicationService.model.ContactEmailAddress;
    this.pncEmail = applicationService.currentVersion.AccountablePersons[0]?.Email;
    
    this.showPncEmail = 
      (applicationService.currentVersion.AccountablePersons[0]?.IsPrincipal === "yes" ?? false)
      && FieldValidations.IsNotNullOrWhitespace(applicationService.currentVersion.AccountablePersons[0]?.Email)
      && applicationService.currentVersion.AccountablePersons[0]?.Email !== this.userEmail;

    this.shouldRender = true;
  }

  override onSave(): void {
  }

  override canAccess(applicationService: ApplicationService): boolean {
    return applicationService.model.SafetyCaseReport?.declaration ?? false;
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    return Promise.resolve(true);
  }

  navigateBackClick(): void {
    this.navigationService.navigate(`application/${this.applicationService.model.id}/application-completed`);
  }
}
