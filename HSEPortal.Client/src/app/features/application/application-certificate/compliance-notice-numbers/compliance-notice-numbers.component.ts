import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationCertificateModel, ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-compliance-notice-numbers',
  templateUrl: './compliance-notice-numbers.component.html',
})
export class  ComplianceNoticeNumbersComponent extends PageComponent<string> {
  static route: string = 'compliance-notice-numbers';
  static title: string =
    'Unique reference numbers of compliance notices currently in force - Register a high-rise building - GOV.UK';

  buildingName?: string;
  maxLength: number = 200;  
  modelValid: boolean = true;  
  errorText?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.buildingName = applicationService.model.BuildingName;
    this.model = applicationService.model.ApplicationCertificate?.ComplianceNoticeNumbers;
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> {
    if (!applicationService.model.ApplicationCertificate) {
      applicationService.model.ApplicationCertificate = new ApplicationCertificateModel();
    }
    applicationService.model.ApplicationCertificate!.ComplianceNoticeNumbers = this.model;
  }

  override canAccess(): boolean {
    return true;
  }

  override isValid(): boolean {
    this.modelValid = (this.model?.length ?? 0) <= this.maxLength;
    this.errorText = !this.modelValid ? `Enter ${this.maxLength} characters or fewer` : undefined;
    return this.modelValid;
  }

  override async navigateNext(): Promise<boolean | void> {
    return Promise.resolve(true);
  }

  checkError() {
    if ((this.model?.length ?? 0) <= this.maxLength) {
      this.modelValid = true;
      this.errorText = undefined;
    }
  }
}
