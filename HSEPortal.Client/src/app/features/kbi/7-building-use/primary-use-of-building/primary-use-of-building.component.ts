import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { SecondaryUseBuildingComponent } from '../secondary-use-building/secondary-use-building.component';
import { KbiService } from 'src/app/services/kbi.service';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-primary-use-of-building',
  templateUrl: './primary-use-of-building.component.html'
})
export class PrimaryUseOfBuildingComponent extends PageComponent<string> {
  static route: string = 'primary-use-of-building';
  static title: string = "Primary Use - Register a high-rise building - GOV.UK";

  errorMessage?: string;

  primaryUseOfBuildingHasErrors = false;

  constructor(activatedRoute: ActivatedRoute, private kbiService: KbiService) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if(!this.applicationService.currentKbiSection?.BuildingUse) this.applicationService.currentKbiSection!.BuildingUse = {}
    if (!this.applicationService.currentKbiSection!.BuildingUse.PrimaryUseOfBuilding) { this.applicationService.currentKbiSection!.BuildingUse.PrimaryUseOfBuilding = ""; }

    this.model = this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding;

    this.errorMessage = `Select the primary use for ${this.getInfraestructureName()}`;

    await this.kbiService.syncStructureRoofStaircasesAndWalls(this.applicationService.currentKbiSection!);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.PrimaryUseOfBuilding = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection!.Walls.ExternalFeatures && this.applicationService.currentKbiSection!.Walls.ExternalFeatures!.length > 0
  }

  override isValid(): boolean {
    this.primaryUseOfBuildingHasErrors = !this.model || this.model === "";
    return !this.primaryUseOfBuildingHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(SecondaryUseBuildingComponent.route, this.activatedRoute);
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentKbiSection!.StructureName;
  }

}
