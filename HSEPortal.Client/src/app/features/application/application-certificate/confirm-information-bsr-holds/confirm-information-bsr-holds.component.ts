import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationCertificateModel, ApplicationService, SectionModel } from 'src/app/services/application.service';
import { ComplianceNoticeNumbersComponent } from '../compliance-notice-numbers/compliance-notice-numbers.component';

@Component({
  selector: 'hse-confirm-information-bsr-holds',
  templateUrl: './confirm-information-bsr-holds.component.html',
})
export class ConfirmInformationBsrHoldsComponent extends PageComponent<void> {
  static route: string = 'confirm-information-bsr-holds';
  static title: string =
    'Confirm the information BSR holds is correct - Register a high-rise building - GOV.UK';

  buildingName?: string;
  buildingId?: string;
  sections?: SectionModel[];
  lastSubmissionDate?: string;
  hasChangesSubmitted?: boolean = false;
  pap?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.buildingName = applicationService.model.BuildingName;
    this.buildingId = applicationService.model.id;
    this.pap = this.getPapName();
    this.sections = applicationService.currentVersion.Sections;
    this.lastSubmissionDate = await this.applicationService.getSubmissionDate();
    this.hasChangesSubmitted = applicationService.model.RegistrationAmendmentsModel !== undefined
      && applicationService.model.RegistrationAmendmentsModel !== null;

    console.log(applicationService.model); 
  }

  private getPapName(): string | undefined {
    var pap = this.applicationService.currentVersion.AccountablePersons[0];

    if (pap.IsPrincipal == "yes") {
      return `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
    }

    if (pap.Type == "individual") {
      return `${pap.FirstName} ${pap.LastName}`;
    }

    return pap.OrganisationName;  
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> {
    if (!applicationService.model.ApplicationCertificate) {
      applicationService.model.ApplicationCertificate = new ApplicationCertificateModel();
    }
    applicationService.model.ApplicationCertificate!.BsrInformationConfirmed = true;
  }

  override canAccess(): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ComplianceNoticeNumbersComponent.route, this.activatedRoute);
  }
}
