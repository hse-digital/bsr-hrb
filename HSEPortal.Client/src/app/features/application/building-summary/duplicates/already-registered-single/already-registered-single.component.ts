import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { AccountablePersonModel, ApplicationService, RegisteredStructureModel } from 'src/app/services/application.service';
import { DuplicatesService } from 'src/app/services/duplicates.service';
import { SectionCheckAnswersComponent } from '../../check-answers/check-answers.component';
import { SectionOtherAddressesComponent } from '../../other-addresses/other-addresses.component';
import { SectionHelper } from 'src/app/helpers/section-helper';

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
  }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    return true;
  }
  
  override async navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentSection.Addresses.length < 5) {
      return this.navigationService.navigateRelative(SectionOtherAddressesComponent.route, this.activatedRoute);
    } else {
      return this.navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, this.activatedRoute);
    }
  }

}
