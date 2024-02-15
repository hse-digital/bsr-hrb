import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationCertificateModel, ApplicationService, SectionModel } from 'src/app/services/application.service';

@Component({
  selector: 'hse-section-89-declaration',
  templateUrl: './section-89-declaration.component.html',
})
export class Section89DeclarationComponent extends PageComponent<void> {
  static route: string = 'section-89-declaration';
  static title: string =
    'Confirm the relevant people are being provided with information - Register a high-rise building - GOV.UK';

  buildingName?: string;
  pap?: string;
  papIsIndividual: boolean = true;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.buildingName = applicationService.model.BuildingName;
    this.pap = this.getPapName();
  }

  private getPapName(): string | undefined {
    var pap = this.applicationService.currentVersion.AccountablePersons[0];

    if (pap.IsPrincipal == "yes") {
      return `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
    }

    if (pap.Type == "individual") {
      return `${pap.FirstName} ${pap.LastName}`;
    }

    this.papIsIndividual = false;
    return pap.OrganisationName;  
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> {
    if (!applicationService.model.ApplicationCertificate) {
      applicationService.model.ApplicationCertificate = new ApplicationCertificateModel();
    }
    applicationService.model.ApplicationCertificate!.Section89DeclarationConfirmed = true;
  }

  override canAccess(): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return Promise.resolve(true);
  }
}
