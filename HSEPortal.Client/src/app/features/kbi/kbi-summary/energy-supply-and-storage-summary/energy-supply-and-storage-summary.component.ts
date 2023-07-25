import { Component, Input } from '@angular/core';
import { Energy, ApplicationService } from 'src/app/services/application.service';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { NavigationService } from 'src/app/services/navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'energy-supply-and-storage-summary',
  templateUrl: './energy-supply-and-storage-summary.component.html'
})
export class EnergySupplyAndStorageSummaryComponent extends KbiSummaryComponent {

  @Input() energySupplyAndStorage: Energy = {};

  constructor(applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(applicationService, navigationService, activatedRoute);
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
