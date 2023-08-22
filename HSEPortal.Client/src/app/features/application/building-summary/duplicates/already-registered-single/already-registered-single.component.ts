import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, RegisteredStructureModel } from 'src/app/services/application.service';
import { DuplicatesService } from 'src/app/services/duplicates.service';
import { SectionCheckAnswersComponent } from '../../check-answers/check-answers.component';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { WhyContinueRegisterComponent } from '../why-continue-register/why-continue-register.component';

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
    if(!this.applicationService.currentSection.Duplicate) {
      this.applicationService.currentSection.Duplicate = {};
    }

    if (!this.applicationService.currentSection.Duplicate.BlockIds) {
      this.applicationService.currentSection.Duplicate.BlockIds = [];
    }

    this.registeredStructure = this.applicationService.currentSection.Duplicate?.RegisteredStructureModel;
    if (!this.registeredStructure || this.registeredStructure.StructureAddress?.Postcode != this.applicationService.currentSectionAddress?.Postcode) {
      this.GetRegisteredStructure();
    }
  }

  private async GetRegisteredStructure() {
    this.registeredStructure = await this.duplicatesService.GetRegisteredStructure();
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.currentSection.Duplicate!.IsDuplicated = true;
    this.applicationService.currentSection.Duplicate?.BlockIds?.push(this.applicationService.currentSection.Duplicate.RegisteredStructureModel!.BlockId!);
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

}
