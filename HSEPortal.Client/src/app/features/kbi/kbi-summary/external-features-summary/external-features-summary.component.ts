import { Component, Input } from '@angular/core';
import { Walls, ApplicationService, KeyValue } from 'src/app/services/application.service';
import { ExternalFeaturesComponent } from '../../6-walls/external-features/external-features.component';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'external-features-summary',
  templateUrl: './external-features-summary.component.html'
})
export class ExternalFeaturesSummaryComponent  extends KbiSummaryComponent {

  @Input() externalFeatures: Walls = {};

  constructor(applicationService: ApplicationService, navigationService: NavigationService) {
    super(applicationService, navigationService);
  }

  getAvailableFeatures(): KeyValue<string, string[]>[] {
    return this.externalFeatures.ExternalFeatures!.filter(x => ExternalFeaturesComponent.features.includes(x.key));
  }

  private externalFeaturesMapper: Record<string, string> = {
    "advertising": "Advertising hoarding attached to a wall",
    "balconies": "Balconies",
    "communal_recreation_area": "Communal recreation area on the roof",
    "communal_walkway": "Communal walkway between structures",
    "escape_route_roof": "Escape route onto and across the roof",
    "external_staircases": "External staircases",
    "machinery_outbuilding": "Machinery in an outbuilding",
    "machinery_roof_room": "Machinery in a room on the roof",
    "machinery_roof": "Machinery on the roof",
    "phone_masts": "Phone masts",
    "roof_lights": "Roof lights",
    "solar_shading": "Solar shading",
    "other": "Other",
    "none": "None"
  }

  getExternalFeature(name: string) {
    return this.externalFeaturesMapper[name] ?? "";
  }

  private featureNameMapper: Record<string, string> = {
    "balconies": "Balconies",
    "communal_walkway": "Communal walkways",
    "escape_route_roof": "Escape route across the roof",
    "solar_shading": "Solar shading",
    "external_staircases": "Staircases",
    "roof_lights": "Roof lights",
    "machinery_outbuilding": "Machinery in an outbuilding",
    "machinery_roof_room": "Machinery in a room on the roof",
    "none": "None"
  }
  getFeatureName(name: string) {
    return this.featureNameMapper[name];
  }

  hasFeature(name: string) {
    if(!this.applicationService.currentKbiSection?.Walls.ExternalFeatures) return false;
    return this.applicationService.currentKbiSection!.Walls.ExternalFeatures!.map(x => x.key).includes(name);
  }

  getMaterials(feature: string): string[] {
    return this.hasFeature(feature) ? this.externalFeatures?.ExternalFeatures?.find(x => x.key == feature)?.value ?? [] : [];
  }

  private materialsMapper: Record<string, string> = {
    "aluminium":   "Aluminium", 
    "concrete": "Concrete", 
    "glass": "Glass", 
    "masonry": "Masonry", 
    "metal": "Metal", 
    "plastic": "Plastic", 
    "slate": "Slate", 
    "timber": "Timber", 
    "other": "Other",
    "none": "None"
  }
  getMaterialName(name: string) {
    return this.materialsMapper[name];
  }

}
