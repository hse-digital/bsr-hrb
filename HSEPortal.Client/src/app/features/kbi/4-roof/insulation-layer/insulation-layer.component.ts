import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { RoofMaterialComponent } from '../roof-material/roof-material.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-insulation-layer',
  templateUrl: './insulation-layer.component.html'
})
export class InsulationLayerComponent  extends PageComponent<string> {
  static route: string = 'roof-insulation';
  static title: string = "Roof insulation - Register a high-rise building - GOV.UK";

  roofInsulationHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentKbiSection!.Roof.RoofInsulation;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Roof.RoofInsulation = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Roof.RoofType;
  }

  override isValid(): boolean {
    this.roofInsulationHasErrors = !this.model;
    return !this.roofInsulationHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(RoofMaterialComponent.route, this.activatedRoute);
  }
  
  getErrorMessage(){
    return `Select if there is any insulation on any part of the roof on ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
