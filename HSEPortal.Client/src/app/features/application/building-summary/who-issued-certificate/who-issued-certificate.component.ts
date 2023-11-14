import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { CertificateIssuerComponent } from '../certificate-issuer/certificate-issuer.component';
import { CompletionCertificateDateComponent } from '../completion-certificate-date/completion-certificate-date.component';
import { BuildingSummaryNavigation } from '../building-summary.navigation';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';

@Component({
  selector: 'hse-who-issued-certificate',
  templateUrl: './who-issued-certificate.component.html'
})
export class WhoIssuedCertificateComponent extends PageComponent<string> {
  static route: string = 'who-issued-certificate';
  static title: string = 'Who issued the completion certificate - Register a high-rise building - GOV.UK';
  
  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.model = this.applicationService.currentSection.WhoIssuedCertificate;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    this.applicationService.currentSection.WhoIssuedCertificate = this.model;
    if (this.model == "bsr") {
      this.applicationService.currentSection.CompletionCertificateIssuer = "The building Safety Regulator (BSR)";
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.model == 'another') {
      return this.navigationService.navigateRelative(CertificateIssuerComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(CompletionCertificateDateComponent.route, this.activatedRoute);
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
