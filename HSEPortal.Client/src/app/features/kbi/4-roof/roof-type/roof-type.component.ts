import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { InsulationLayerComponent } from '../insulation-layer/insulation-layer.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-roof-type',
  templateUrl: './roof-type.component.html'
})
export class RoofTypeComponent  extends PageComponent<string> {
  static route: string = 'roof-type';
  static title: string = "Type of roof - Register a high-rise building - GOV.UK";

  roofTypeHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }
 
  override onInit(applicationService: ApplicationService): void {
    if(!this.applicationService.currentKbiSection?.Roof) this.applicationService.currentKbiSection!.Roof = {}
    this.model = this.applicationService.currentKbiSection!.Roof.RoofType;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Roof.RoofType = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.BuildingStructure.BuildingStructureType && this.applicationService.currentKbiSection!.BuildingStructure.BuildingStructureType.length > 0;
  }

  override isValid(): boolean {
    this.roofTypeHasErrors = !this.model;
    return !this.roofTypeHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(InsulationLayerComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  getErrorMessage() {
    return `Select the type of roof on ${this.getInfraestructureName()}`
  }
}
