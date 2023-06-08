import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BuildingUse} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiStructureModule } from "../3-structure/kbi.structure.module";

@Component({
  selector: 'changes-since-completion-answers',
  templateUrl: './changes-since-completion-answers.component.html'
})
export class ChangesSinceCompletionAnswers {

  @Input() buildingUse: BuildingUse = {};

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  navigate(url: string) {
    console.log(`${KbiFireModule.baseRoute}/${url}`);
    this.navigationService.navigateRelative(`../${KbiStructureModule.baseRoute}/${url}`, this.activatedRoute);
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
    "asbestos_removal": "Asbestos remova",
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
    "otherinstallation_replacement_removal_gas_supply": "Changes to gas supply",
    "reinforcement_works_large_panel_system": "Reinforcement of large panel system structure",
    "work_external_walls": "Work connected to external walls",
    "unknown": "Not Known",
  }
  getBuildingWorksName(name: string) {
    return this.materialNameMapper[name];
  }

}
