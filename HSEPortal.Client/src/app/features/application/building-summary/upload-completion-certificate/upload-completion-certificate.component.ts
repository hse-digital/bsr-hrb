import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { SectionAddressComponent } from '../address/address.component';

type error = { hasError: boolean, message?: string }

@Component({
  selector: 'hse-upload-completion-certificate',
  templateUrl: './upload-completion-certificate.component.html'
})
export class UploadCompletionCertificateComponent extends PageComponent<string> {
  static route: string = 'upload-completion-certificate';
  static title: string = "Upload completion certificate - Register a high-rise building - GOV.UK";

  isOptional: boolean = true;
  certificateHasErrors: boolean = false;

  errors = {
    empty: { hasError: false, message: `Upload the completion certificate for ${this.sectionBuildingName()}` } as error,
    extension: { hasError: false, message: "The selected file must be ODS, PDF, JPG, TIF, BMP or PNG"} as error,
    size: { hasError: false, message: "The selected file must be smaller than 25mb"} as error,
    issue: { hasError: false, message: "The selected file could not be uploaded – try again"} as error
  };

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override onInit(applicationService: ApplicationService): void {
    let date =  new Date(Number(this.applicationService.currentSection.CompletionCertificateDate));
    let FirstOctober2023 = new Date(2023, 9, 1); // Month is October, but index is 9 -> "The month as a number between 0 and 11 (January to December)."
    this.isOptional = date < FirstOctober2023;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(SectionAddressComponent.route,  this.activatedRoute);
  }

  get errorMessage() {
    return `Upload the completion certificate for ${this.sectionBuildingName()}`;
  }

}
