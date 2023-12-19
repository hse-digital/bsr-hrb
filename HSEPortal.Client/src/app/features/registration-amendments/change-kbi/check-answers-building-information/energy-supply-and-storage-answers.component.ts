import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Energy } from "src/app/services/application.service";
import { KbiService } from "src/app/services/kbi.service";
import { EnergySupplyComponent } from "src/app/features/kbi/2-energy/energy-supply/energy-supply.component";
import { EnergyTypeComponent } from "src/app/features/kbi/2-energy/energy-type/energy-type.component";
import { KbiEnergyModule } from "src/app/features/kbi/2-energy/kbi.energy.module";
import { OnSiteEnergyGenerationComponent } from "src/app/features/kbi/2-energy/on-site-energy-generation/on-site-energy-generation.component";
import { ChangeBuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";

@Component({
  selector: 'energy-supply-and-storage-answers',
  templateUrl: './energy-supply-and-storage-answers.component.html'
})
export class ChangeEnergySupplyAndStorageAnswersComponent extends ChangeBuildingInformationCheckAnswersComponent {

  @Input() energySupplyAndStorage: Energy = {};

  constructor(activatedRoute: ActivatedRoute, kbiService: KbiService) {
    super(activatedRoute, kbiService);
  }

  navigateToEnergyStorage() {
    this.navigateTo(EnergyTypeComponent.route, KbiEnergyModule.baseRoute);
  }

  navigateToOnSiteGeneration() {
    this.navigateTo(OnSiteEnergyGenerationComponent.route, KbiEnergyModule.baseRoute);
  }

  navigateToEnergySupplies() {
    this.navigateTo(EnergySupplyComponent.route, KbiEnergyModule.baseRoute);
  }

  private energyStorageMapper: Record<string, string> = {
    "hydrogen_batteries": "Hydrogen batteries",
    "lithium_ion_batteries": "Lithium ion batteries",
    "other": "Other",
    "none": "None"
  }
  getEnergyStorageName(name: string) {
    return this.energyStorageMapper[name];
  }

  private onSiteGenerationMapper: Record<string, string> = {
    "air-ground-source-heat-pumps": "Air or ground source heat pumps",
    "biomass-boiler": "Biomass boiler",
    "solar-wind": "Solar panels or wind turbines",
    "other": "Other",
    "none": "None"
  }
  getOnSiteGenerationName(name: string) {
    return this.onSiteGenerationMapper[name];
  }

  private energySupplyName: Record<string, string> = {
    "energy-supply-communal": "District or communal heating",
    "energy-supply-mains-electric": "Mains electricity supply",
    "energy-supply-mains-hydrogen": "Mains hydrogen supply",
    "energy-supply-mains-gas": "Mains gas supply",
    "energy-supply-oil": "Oil",
    "energy-supply-other": "Other",
    "none": "None"
  }
  getEnergySupplyName(name: string) {
    return this.energySupplyName[name];
  }


}
