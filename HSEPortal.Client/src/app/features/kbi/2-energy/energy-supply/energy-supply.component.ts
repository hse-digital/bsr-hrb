import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxComponent } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';
import { BuildingStructureTypeComponent } from '../../3-structure/building-structure-type/building-structure-type.component';
import { KbiStructureModule } from '../../3-structure/kbi.structure.module';
import { KbiService } from 'src/app/services/kbi.service';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-energy-supply',
  templateUrl: './energy-supply.component.html'
})
export class EnergySupplyComponent extends PageComponent<string[]> {
  static route: string = 'supply';
  static title: string = "Energy supplies to - Register a high-rise building - GOV.UK";

  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  energySupplyHasErrors = false;
  firstCheckboxAnchorId?: string;

  constructor(activatedRoute: ActivatedRoute, private kbiService: KbiService) {
    super(activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.Energy.EnergySupply) { this.applicationService.currentKbiSection!.Energy.EnergySupply = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Energy.EnergySupply);
    this.errorMessage = `Select the types of energy supply in ${this.getInfraestructureName()}`;
  }

  override async onSave(): Promise<void> {
    this.applicationService.currentKbiSection!.Energy.EnergySupply = CloneHelper.DeepCopy(this.model);
    var sectionModel = this.applicationService.currentKbiSection;
    await this.kbiService.syncFireEnergy(sectionModel);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Energy.OnsiteEnergyGeneration
      && this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration.length > 0;
  }

  override isValid(): boolean {
    this.energySupplyHasErrors = !this.model || this.model.length == 0;
    
    if (this.energySupplyHasErrors) this.firstCheckboxAnchorId = `communal-${this.checkboxes?.first.innerId}`;

  return !this.energySupplyHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../${KbiStructureModule.baseRoute}/${BuildingStructureTypeComponent.route}`, this.activatedRoute);
  }
}
