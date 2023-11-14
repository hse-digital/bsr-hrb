import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, RegisteredStructureModel } from 'src/app/services/application.service';
import { DuplicatesService } from 'src/app/services/duplicates.service';
import { SectionCheckAnswersComponent } from '../../check-answers/check-answers.component';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { WhyContinueRegisterComponent } from '../why-continue-register/why-continue-register.component';
import { AddressModel } from 'src/app/services/address.service';
import { BuildingChangeCheckAnswersComponent } from 'src/app/features/registration-amendments/change-building-summary/building-change-check-answers/building-change-check-answers.component';

@Component({
  selector: 'hse-already-registered-single',
  templateUrl: './already-registered-single.component.html'
})
export class AlreadyRegisteredSingleComponent extends PageComponent<void> {
  public static route: string = "already-registered-single";
  public static title: string = "This building has already been registered - Register a high-rise building - GOV.UK";

  registeredStructure?: RegisteredStructureModel;
  addressIndex?: number;

  constructor(private duplicatesService: DuplicatesService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.addressIndex = Number(this.applicationService.currentSection.Duplicate!.DuplicatedAddressIndex);

    if(!this.applicationService.currentSection.Duplicate) {
      this.applicationService.currentSection.Duplicate = {};
    }

    if (!this.applicationService.currentSection.Duplicate.BlockIds) {
      this.applicationService.currentSection.Duplicate.BlockIds = [];
    }

    if (!this.applicationService.model.DuplicateBuildingApplicationIds) {
      this.applicationService.model.DuplicateBuildingApplicationIds = [];
    }

    this.registeredStructure = this.applicationService.currentSection.Duplicate?.RegisteredStructureModel;
    
    let currentAddress = this.applicationService.currentSectionAddress;

    if (!this.registeredStructure || this.registeredStructure.StructureAddress?.Postcode != currentAddress?.Postcode) {
      this.GetRegisteredStructure();
    }
  }

  override nextChangeRoute(): string {
    if (this.applicationService.currentSection.Addresses.length < 5) {
      return WhyContinueRegisterComponent.route;
    } else {
      return BuildingChangeCheckAnswersComponent.route;
    }
  }

  private async GetRegisteredStructure() {
    this.registeredStructure = await this.duplicatesService.GetRegisteredStructure(this.addressIndex);
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.currentSection.Duplicate!.IsDuplicated = true;
    this.applicationService.model.DuplicateDetected = true;
    this.applicationService.currentSection.Duplicate?.BlockIds?.push(this.applicationService.currentSection.Duplicate.RegisteredStructureModel!.BlockId!);
    this.applicationService.model.DuplicateBuildingApplicationIds?.push(this.applicationService.currentSection.Duplicate!.RegisteredStructureModel!.BuildingApplicationId!);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentSection.Addresses.length < 5) {
      return this.navigationService.navigateRelative(WhyContinueRegisterComponent.route, this.activatedRoute);
    } else {
      return this.navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, this.activatedRoute);
    }
  }

  get currentSectionAddress(): AddressModel {
    return this.applicationService.currentSectionAddress;
  }

}
