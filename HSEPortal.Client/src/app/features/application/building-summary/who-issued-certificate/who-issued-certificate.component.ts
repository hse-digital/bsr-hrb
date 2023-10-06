import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-who-issued-certificate',
  templateUrl: './who-issued-certificate.component.html'
})
export class WhoIssuedCertificateComponent extends PageComponent<string> {
  static route: string = 'who-issued-certificate';
  static title: string = 'Who issued the completion certificate - Register a high-rise building - GOV.UK';
  
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.model = this.applicationService.currentSection.WhoIssuedCertificate;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    this.applicationService.currentSection.WhoIssuedCertificate = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    throw new Error('Method not implemented.');
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override navigateNext(): Promise<boolean | void> {
    throw new Error('Method not implemented.');
  }

  get errorMessage() {
    return `Select who issued the completion certificate for ${this.buildingName}`;
  }

  get buildingName() {
    return this.applicationService.model.NumberOfSections == "one" 
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

}
