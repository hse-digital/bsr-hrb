import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Energy } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiEnergyModule } from "../2-energy/kbi.energy.module";

@Component({
  selector: 'energy-supply-and-storage-answers',
  templateUrl: './energy-supply-and-storage-answers.component.html'
})
export class EnergySupplyAndStorageAnswersComponent {

  @Input() energySupplyAndStorage: Energy = {};

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  navigate(url: string) {
    console.log(`${KbiFireModule.baseRoute}/${url}`);
    this.navigationService.navigateRelative(`../${KbiEnergyModule.baseRoute}/${url}`, this.activatedRoute);
  }

  private energyStorageMapper: Record<string, string> = {
    "hydrogen_batteries": "Hydrogen batteries",
    "lithium_ion_batteries": "Lithium ion batteries",
    "other": "Other"

  }
  getEnergyStorageName(name: string) {
    return this.energyStorageMapper[name];
  }

  private onSiteGenerationMapper: Record<string, string> = {
    "air-ground-source-heat-pumps": "Air or ground source heat pumps",
    "biomass-boiler": "Biomass boiler",
    "solar-wind": "Solar panels or wind turbines",
    "other": "Other"
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
    "energy-supply-other": "Other"
  }
  getEnergySupplyName(name: string) {
    return this.energySupplyName[name];
  }


}
