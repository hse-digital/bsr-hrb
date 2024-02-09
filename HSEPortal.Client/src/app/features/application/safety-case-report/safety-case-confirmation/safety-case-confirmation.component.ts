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

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.applicationReference = applicationService.model.id;
    this.buildingName = applicationService.model.BuildingName;
    this.userEmail = applicationService.model.ContactEmailAddress;

    this.pncEmail = this.getPncEmail();
    this.showPncEmail = this.pncEmail != undefined;
  }

  private getPncEmail(): string | undefined {
    var pap = this.applicationService.currentVersion.AccountablePersons[0];

    if (pap.IsPrincipal == "yes") {
      return undefined;
    }

    if (pap.Type == "individual") {
      return pap.Email;
    }

    console.log('here');
    return pap.NamedContactEmail ?? pap.LeadEmail;  
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
