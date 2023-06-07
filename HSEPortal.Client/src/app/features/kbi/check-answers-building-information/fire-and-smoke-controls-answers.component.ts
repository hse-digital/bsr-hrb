import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Fire } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";

@Component({
  selector: 'fire-and-smoke-controls-answers',
  templateUrl: './fire-and-smoke-controls-answers.component.html'
})
export class FireAndSmokeControlsAnswersComponent {

  @Input() fireAndSmokeControls: Fire = {};

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  navigate(url: string) {
    console.log(`${KbiFireModule.baseRoute}/${url}`);
    this.navigationService.navigateRelative(`../${KbiFireModule.baseRoute}/${url}`, this.activatedRoute);
  }

  private equipmentNameMapper: Record<string, string> = {
    "alarm_heat_smoke": "Alarm sounders (connected to detectors)",
    "alarm_call_points": "Alarm sounders (connected to call points)",
    "fire_dampers": "Fire dampers",
    "fire_extinguishers": "Fire extinguishers",
    "fire_shutters": "Fire shutters",
    "heat_detectors": "Heat detectors",
    "risers_dry": "Risers dry",
    "risers_wet": "Risers wet",
    "smoke_aovs": "Automatic smoke control systems",
    "smoke_manual": "Manual smoke control systems",
    "smoke_detectors": "Smoke detectors",
    "sprinklers_misters": "Sprinklers and misters",
  }
  getEquipmentName(equipment: string) {
    return this.equipmentNameMapper[equipment];
  }

  private evacuationTypeMapper: Record<string, string> = {
    "phased": "Phased",
    "progressive_horizontal": "Progressive horizontal",
    "simultaneous": "Simultaneous",
    "stay_put": "Stay put (defend in place)",
    "temporary_simultaneous": "Temporary simultaneous"
  }
  getEvacuationType(evacuationType: string) {
    return this.evacuationTypeMapper[evacuationType];
  }

  private locationNameMapper: Record<string, string> = {
    "basement": "Basement",
    "bin_store": "Bin store",
    "car_park": "Car park",
    "common_balcony": "Common balcony",
    "common_corridor": "Common corridor",
    "common_staircase": "Common staircase",
    "external_staircase": "External staircase",
    "lobby": "Lobby",
    "share_space_equipment": "Shared space with equipment",
    "share_space_no_equipment": "Shared space with no equipment",
    "rooftop": "Rooftop",
    "other": "Other",
  }
  getLocationName(location: string) {
    return this.locationNameMapper[location];
  }

  getSmokeAndFireDeviceLocations() {

    if (this.fireAndSmokeControls.FireSmokeProvisionLocations!["smoke_detectors"]) {
      const test = this.fireAndSmokeControls!.FireSmokeProvisionLocations!["smoke_detectors"].map((location: string) => {
          (        location: string) => this.getLocationName(location);
      });
      console.log(test);
      return this.fireAndSmokeControls!.FireSmokeProvisionLocations!["smoke_detectors"];
      
    }
    else {
      return ["No smoke detectors"]
    }
  }
}
