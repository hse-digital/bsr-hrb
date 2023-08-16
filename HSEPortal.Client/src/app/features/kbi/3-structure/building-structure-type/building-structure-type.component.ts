import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { RoofTypeComponent } from '../../4-roof/roof-type/roof-type.component';
import { KbiRoofModule } from '../../4-roof/kbi.roof.module';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-building-structure-type',
  templateUrl: './building-structure-type.component.html'
})
export class BuildingStructureTypeComponent extends PageComponent<string[]> {
  static route: string = 'building-structure-type';
  static title: string = "Structure type - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  buildingStructureTypeHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection?.BuildingStructure) this.applicationService.currentKbiSection!.BuildingStructure = {}
    if (!this.applicationService.currentKbiSection!.BuildingStructure.BuildingStructureType) { this.applicationService.currentKbiSection!.BuildingStructure.BuildingStructureType = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.BuildingStructure.BuildingStructureType);
    this.errorMessage = `Select the type of structure in ${this.getInfraestructureName()} , or select \'None of these\'`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingStructure.BuildingStructureType = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Energy.EnergySupply && this.applicationService.currentKbiSection!.Energy.EnergySupply!.length > 0;
  }

  override isValid(): boolean {
    this.buildingStructureTypeHasErrors = !this.model || this.model?.length == 0;

    if (this.buildingStructureTypeHasErrors) this.firstCheckboxAnchorId = `composite_steel_concrete-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;

    return !this.buildingStructureTypeHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../${KbiRoofModule.baseRoute}/${RoofTypeComponent.route}`, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
