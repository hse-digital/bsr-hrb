import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, BuildingUse} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiBuildingUseModule } from "../7-building-use/kbi.building-use.module";
import { TitleService } from "src/app/services/title.service";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { KbiNavigation } from "../kbi.navigation.ts.service";
import { KbiService } from "src/app/services/kbi.service";

@Component({
  selector: 'changes-since-completion-answers',
  templateUrl: './changes-since-completion-answers.component.html'
})
export class ChangesSinceCompletionAnswers extends BuildingInformationCheckAnswersComponent {

  @Input() buildingUse: BuildingUse = {};

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, kbiNavigation: KbiNavigation, kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService, kbiNavigation, kbiService);
  }

  navigate(url: string) {
    this.navigateTo(url, KbiBuildingUseModule.baseRoute);
  }

  private materialNameMapper: Record<string, string> = {
    "composite_steel_concrete": "Composite steel and concrete",
    "concrete_large_panels_1960": "Concrete large panel system - 1960s",
    "concrete_large_panels_1970": "Concrete large panel system - 1970 onwards",
    "modular_concrete": "Modular - concrete",
    "concrete_other": "Concrete - other",
    "lightweight_metal": "Lightweight metal structure, like aluminium",
    "Masonry": "Masonry",
    "modular_steel": "Modular - steel",
    "steel_frame": "Steel frame",
    "modular_other_metal": "Modular - other metal",
    "modular_timber": "Modular - timber",
    "timber": "Timber",
    "none": "None"
  }
  getMaterialName(name: string) {
    return this.materialNameMapper[name];
  }

  private buildingWorksMapper: Record<string, string> = {
    "asbestos_removal": "Asbestos removal",
    "balconies_added": "Balconies added",
    "changes_residential_units": "Change to number of residential units",
    "changes_staircase_cores": "Changes to staircases",
    "changes_windows": "Changes to windows",
    "complete_rewiring": "Complete rewiring",
    "floors_added": "Change to number of floors",
    "floors_removed": "Change to number of floors",
    "installation_replacement_removal_fire_systems": "Changes to fire systems",
    "installation_replacement_removal_lighting": "Changes to lighting",
    "installation_replacement_removal_cold_water_systems": "Changes to cold water systems",
    "installation_replacement_removal_gas_supply": "Changes to gas supply",
    "reinforcement_works_large_panel_system": "Reinforcement of large panel system structure",
    "work_external_walls": "Work connected to external walls",
    "unknown": "Not Known",
    "none": "None"
  }
  getBuildingWorksName(name: string) {
    return this.buildingWorksMapper[name];
  }

  private buildingUseMapper: Record<string, string> = {
    "assembly_and_recreation": "Assembly and recreation",
    "assembly_recreation": "Assembly and recreation",
    "office": "Office",
    "residential_institution": "Residential institution",
    "other_residential_use": "Other residential use",
    "shop_commercial": "Shop and commercial",
    "other_non_residential": "Other non-residential",
    "none": "None"

  }
  getBuildingUse(name: string) {
    return this.buildingUseMapper[name];
  }

  changeInNumberOfFloors() {
    return this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.some(x => x == 'floors_added')
  }

  notChangeInNumberOfFloors() {
    return this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length > 1 
       && !this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'none' || x == 'unknown')
  }

  onlyOneOptionSelected() {
    let onlyOneMaterialChange = (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length == 1);
    let mostRecentChangeIsKnown = !this.applicationService.currentKbiSection?.BuildingUse.MostRecentMaterialChange?.includes("unknown");
    let isNoneOrUnknown = this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'none' || x == 'unknown')
    
    return !isNoneOrUnknown && (onlyOneMaterialChange || mostRecentChangeIsKnown);
  }

}
