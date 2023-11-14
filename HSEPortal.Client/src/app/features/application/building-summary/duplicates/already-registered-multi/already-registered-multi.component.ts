import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, RegisteredStructureModel } from 'src/app/services/application.service';
import { DuplicatesService } from 'src/app/services/duplicates.service';
import { SectionCheckAnswersComponent } from '../../check-answers/check-answers.component';
import { SectionOtherAddressesComponent } from '../../other-addresses/other-addresses.component';
import { KeepStructureDeclarationComponent } from '../keep-structure-declaration/keep-structure-declaration.component';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { BuildingChangeCheckAnswersComponent } from 'src/app/features/registration-amendments/change-building-summary/building-change-check-answers/building-change-check-answers.component';

@Component({
  selector: 'hse-already-registered-multi',
  templateUrl: './already-registered-multi.component.html'
})
export class AlreadyRegisteredMultiComponent extends PageComponent<string> {
  public static route: string = "already-registered-multi";
  public static title: string = "This building has already been registered - Register a high-rise building - GOV.UK";

  addressIndex?: number;
  registeredStructure?: RegisteredStructureModel;

  constructor(private duplicatesService: DuplicatesService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if (!this.applicationService.currentSection.Duplicate) {
      this.applicationService.currentSection.Duplicate = { BlockIds: [] }
    }

    if (!this.applicationService.model.DuplicateBuildingApplicationIds) {
      this.applicationService.model.DuplicateBuildingApplicationIds = [];
    }

    this.addressIndex = this.applicationService.currentSection.Duplicate!.DuplicatedAddressIndex;

    this.registeredStructure = this.applicationService.currentSection.Duplicate?.RegisteredStructureModel;
    
    let currentAddress = this.applicationService.currentSectionAddress;
    
    this.model = this.applicationService.currentSection.Duplicate!.IncludeStructure;

    if (!this.registeredStructure || this.registeredStructure.StructureAddress?.Postcode != currentAddress?.Postcode) {
      this.GetRegisteredStructure();
    }
  }

  private async GetRegisteredStructure() {
    this.registeredStructure = await this.duplicatesService.GetRegisteredStructure(this.addressIndex! - 1);
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.currentSection.Duplicate!.IncludeStructure = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService)
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.changing) this.registrationAmendmentsNavigation();

    if (this.model == 'yes') {
      return this.navigationService.navigateRelative(KeepStructureDeclarationComponent.route, this.activatedRoute);
    } else if (this.applicationService.currentSection.Addresses.length < 5) {
      return this.navigationService.navigateRelative(SectionOtherAddressesComponent.route, this.activatedRoute);
    } else {
      return this.navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, this.activatedRoute);
    }
  }

  private registrationAmendmentsNavigation(): string {
    if (this.model == 'yes') {
      return KeepStructureDeclarationComponent.route;
    } else if (this.applicationService.currentSection.Addresses.length < 5) {
      return SectionOtherAddressesComponent.route
    } else {
      return BuildingChangeCheckAnswersComponent.route;
    }
  }

  get errorMessage() {
    return `Select yes if you would like to include ${this.applicationService.currentSection.Name} in your application`;
  }

  get section() {
    return this.applicationService.currentSection;
  }

  get address() {
    return this.applicationService.currentSectionAddress;
  }

}
