import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, RegisteredStructureModel } from 'src/app/services/application.service';
import { SectionCheckAnswersComponent } from '../../check-answers/check-answers.component';
import { SectionOtherAddressesComponent } from '../../other-addresses/other-addresses.component';
import { DuplicatesService } from 'src/app/services/duplicates.service';

@Component({
  selector: 'hse-why-continue-register',
  templateUrl: './why-continue-register.component.html'
})
export class WhyContinueRegisterComponent extends PageComponent<string> {
  static route: string = "why-continue";
  static title: string = "Why do you want to continue? - Register a high-rise building - GOV.UK";

  addressIndex?: number;
  registeredStructure?: RegisteredStructureModel;

  constructor(private duplicatesService: DuplicatesService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if (!this.applicationService.currentSection.Duplicate) {
      this.applicationService.currentSection.Duplicate = { IsDuplicated: true, IncludeStructure: "yes", WhyContinue: "" }
    }
    this.model = this.applicationService.currentSection.Duplicate.WhyContinue;
    
    this.registeredStructure = this.applicationService.currentSection.Duplicate?.RegisteredStructureModel;
    if (!this.registeredStructure || this.registeredStructure.StructureAddress?.Postcode != this.applicationService.currentSectionAddress?.Postcode) {
      this.GetRegisteredStructure();      
    }
  }

  private async GetRegisteredStructure() {
    this.registeredStructure = await this.duplicatesService.GetRegisteredStructure();
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
    this.applicationService.currentSection.Duplicate!.WhyContinue = this.model;
    this.applicationService.model.ShareDetailsDeclared = true;
  }

  override canAccess(applicationService: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentSection.Addresses.length < 5) {
      return this.navigationService.navigateRelative(SectionOtherAddressesComponent.route, this.activatedRoute);
    } else {
      return this.navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, this.activatedRoute);
    }
  }

  get errorMessage() {
    return `Select why you want to continue applying to register ${this.applicationService.model.BuildingName}`
  }

}
