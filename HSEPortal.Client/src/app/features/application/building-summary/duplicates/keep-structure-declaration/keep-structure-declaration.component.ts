import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, RegisteredStructureModel } from 'src/app/services/application.service';
import { WhyContinueRegisterComponent } from '../why-continue-register/why-continue-register.component';
import { firstValueFrom } from 'rxjs';
import { DuplicatesService } from 'src/app/services/duplicates.service';

@Component({
  selector: 'hse-keep-structure-declaration',
  templateUrl: './keep-structure-declaration.component.html'
})
export class KeepStructureDeclarationComponent extends PageComponent<void> {
  static route: string = "keep-structure-declaration";
  static title: string = "Keep structure in your application - Register a high-rise building - GOV.UK";

  addressIndex?: number;
  registeredStructure?: RegisteredStructureModel;

  constructor(private duplicatesService: DuplicatesService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if (!this.applicationService.currentSection.Duplicate) {
      this.applicationService.currentSection.Duplicate = { IncludeStructure: "yes" };
    }

    this.registeredStructure = this.applicationService.currentSection.Duplicate?.RegisteredStructureModel;
    if (!this.registeredStructure || this.registeredStructure.StructureAddress?.Postcode != this.applicationService.currentSectionAddress?.Postcode) {
      this.GetRegisteredStructure();      
    }

    this.getPapName();
  }

  private async GetRegisteredStructure() {
    this.registeredStructure = await this.duplicatesService.GetRegisteredStructure();
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.Duplicate!.IsDuplicated = true;
  }

  override canAccess(applicationService: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentSection.Duplicate?.IncludeStructure && this.applicationService.currentSection.Duplicate?.IncludeStructure.length > 0;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(WhyContinueRegisterComponent.route, this.activatedRoute);
  }

  papName?: string;
  getPapName(): void {
    let pap = this.applicationService.model.AccountablePersons[0];
    this.papName = "the principal accountable person"
    if (!!pap && pap.Type == 'organisation' && FieldValidations.IsNotNullOrWhitespace(pap.OrganisationName)) {
      this.papName = pap.OrganisationName;
    }
  }

}
