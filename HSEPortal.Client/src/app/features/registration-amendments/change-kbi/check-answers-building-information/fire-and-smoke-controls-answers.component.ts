import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Fire } from "src/app/services/application.service";
import { KbiService } from "src/app/services/kbi.service";
import { KbiFireModule } from "src/app/features/kbi/1-fire/kbi.fire.module";
import { ChangeBuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";

@Component({
  selector: 'fire-and-smoke-controls-answers',
  templateUrl: './fire-and-smoke-controls-answers.component.html'
})
export class ChangeFireAndSmokeControlsAnswersComponent extends ChangeBuildingInformationCheckAnswersComponent {

  @Input() fireAndSmokeControls: Fire = {};

  constructor(activatedRoute: ActivatedRoute, kbiService: KbiService) {
    super(activatedRoute, kbiService);
  }

  navigate(url: string, equipment?: string) {
    let query = equipment ? { equipment: equipment }: undefined;
    this.navigateTo(url, KbiFireModule.baseRoute, query);
  }

  private provisionEquipment: Record<string, string> = {
    "heat_detectors": "Heat detectors",
    "smoke_detectors": "Smoke detectors",
    "sprinklers": "Sprinklers or misters",
    "none": "None"
  }
  getProvisionEquipment(name: string) {
    return this.provisionEquipment[name];
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
    "none": "None"
  }
  getEquipmentName(equipment: string) {
    return this.equipmentNameMapper[equipment];
  }

  private evacuationTypeMapper: Record<string, string> = {
    "phased": "Phased",
    "progressive_horizontal": "Progressive horizontal",
    "simultaneous": "Simultaneous",
    "stay_put": "Stay put (defend in place)",
    "temporary_simultaneous": "Temporary simultaneous",
    "none": "None"
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
    "none": "None"
  }
  getLocationName(location: string) {
    return this.locationNameMapper[location];
  }

  getSmokeAndFireDeviceLocations(device: string) {
    if (!!this.fireAndSmokeControls.FireSmokeProvisionLocations && Object.keys(this.fireAndSmokeControls.FireSmokeProvisionLocations!).includes(device)) {
      return this.fireAndSmokeControls!.FireSmokeProvisionLocations![device].map(location => this.getLocationName(location));
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

  private provisionsWithoutLocation = ["risers_dry", "risers_wet", "fire_extinguishers"];
  get provisionsWithLocations() {
    return this.applicationService.currentVersion.Kbi?.KbiSections.at(this.index!)!.Fire.FireSmokeProvisions?.filter(x => !this.provisionsWithoutLocation.includes(x));
  }

}
