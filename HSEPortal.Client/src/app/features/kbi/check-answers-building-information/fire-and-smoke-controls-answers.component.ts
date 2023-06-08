import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, Fire } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { TitleService } from "src/app/services/title.service";
import { KbiNavigation } from "../kbi.navigation.ts.service";

@Component({
  selector: 'fire-and-smoke-controls-answers',
  templateUrl: './fire-and-smoke-controls-answers.component.html'
})
export class FireAndSmokeControlsAnswersComponent extends BuildingInformationCheckAnswersComponent {

  @Input() fireAndSmokeControls: Fire = {};

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, kbiNavigation: KbiNavigation) {
    super(router, applicationService, navigationService, activatedRoute, titleService, kbiNavigation);
  }

  navigate(url: string) {
    this.navigateTo(url, KbiFireModule.baseRoute);
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
      return this.fireAndSmokeControls!.FireSmokeProvisionLocations!["smoke_detectors"].map(location => this.getLocationName(location));
    }
    else {
      return ["No smoke detectors"]
    }
  }

  private LiftTypeMapper: Record<string, string> = {
    "evacuation": "Evacuation lift",
    "firefighters": "Firefighters lift",
    "fire-fighting": "Fire-fighting lift",
    "modernised": "Modernised lift for fire service use",
    "firemen": "Firemen's lift",
    "none": "None"
  }
  getLiftTypeName(liftTYpe: string) {
    return this.LiftTypeMapper[liftTYpe];
  }

  getLiftTypes() {

    if (this.fireAndSmokeControls.Lifts) {
      return this.fireAndSmokeControls!.Lifts.map(lift => this.getLiftTypeName(lift));
    }
    else {
      return ["No lifts"]
    }
  }

  getTotalResidentialFireDoors() {

    if (!!this.fireAndSmokeControls.ResidentialUnitFrontDoors) {
      return Number(this.fireAndSmokeControls.ResidentialUnitFrontDoors.NoFireResistance!)
        + Number(this.fireAndSmokeControls.ResidentialUnitFrontDoors.ThirtyMinsFireResistance!)
        + Number(this.fireAndSmokeControls.ResidentialUnitFrontDoors.SixtyMinsFireResistance!)
        + Number(this.fireAndSmokeControls.ResidentialUnitFrontDoors.HundredTwentyMinsFireResistance!)
        + Number(this.fireAndSmokeControls.ResidentialUnitFrontDoors.NotKnownFireResistance!);
    }
    else {
      return 0;
    }
  }
    getTotalCommonFireDoors() {

      if (!!this.fireAndSmokeControls.FireDoorsCommon) {
        return Number(this.fireAndSmokeControls.FireDoorsCommon.FireDoorThirtyMinute!)
          + Number(this.fireAndSmokeControls.FireDoorsCommon.FireDoorSixtyMinute!)
          + Number(this.fireAndSmokeControls.FireDoorsCommon.FireDoorHundredTwentyMinute!)
          + Number(this.fireAndSmokeControls.FireDoorsCommon.FireDoorUnknown!)
      }
      else {
        return 0;
      }

  }

}
