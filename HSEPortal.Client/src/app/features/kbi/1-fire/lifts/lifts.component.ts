import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { ApplicationService } from 'src/app/services/application.service';
import { ResidentialUnitFrontDoorsFireResistanceComponent } from '../residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-lifts',
  templateUrl: './lifts.component.html'
})
export class LiftsComponent extends PageComponent<string[]> {
  static route: string = 'lifts';
  static title: string = "Types of lift - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  liftsHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.Fire.Lifts) { this.applicationService.currentKbiSection!.Fire.Lifts = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Fire.Lifts);
    this.errorMessage = `Select the types of lift in ${this.getInfraestructureName()}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Fire.Lifts = CloneHelper.DeepCopy(this.model);
  }

  override isValid(): boolean {
    this.liftsHasErrors = !this.model || this.model?.length == 0;

    if (this.liftsHasErrors) this.firstCheckboxAnchorId = `evacuation-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;

    return !this.liftsHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ResidentialUnitFrontDoorsFireResistanceComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let provisions = this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions;
    let provisionsWithLocations = this.getProvisionsWithLocation();
    let locations = this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations 

    if(this.isNone(provisions)) return true;
    
    if(!provisions || provisions.length == 0) return false;

    return !provisionsWithLocations || provisionsWithLocations.length == 0 || (!!locations && Object.keys(locations).length > 0 && Object.values(locations).every(x => x.length > 0));
  }

  private isNone(provisions?: string[]) {
    return !!provisions && provisions?.length == 1 && provisions![0] == 'none';
  }

  private provisionsWithoutLocation = ["risers_dry", "risers_wet", "fire_extinguishers"]
  getProvisionsWithLocation() {
    return this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions?.filter(x => !this.provisionsWithoutLocation.includes(x));
  }

}
