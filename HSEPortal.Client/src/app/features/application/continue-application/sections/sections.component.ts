import { Component } from "@angular/core";
import { BuildingRegistrationService } from "src/app/services/building-registration.service";

@Component({
  templateUrl: './sections.component.html'
})
export class ApplicationsSectionsComponent {
  static route: string = 'sections';

  constructor(private buildingRegistrationService: BuildingRegistrationService) { }

  getBuildingName() {
    return this.buildingRegistrationService.model.BuildingName;
  }

  tasks = [
    {
      title: "Prepare your application",
      items: [
        {
          title: "Blocks in the building",
          tag: "NOT STARTED YET",
          link: "/building-registration/building/number-blocks-building",
          status: 0
        },
        {
          title: "Principal accountable person",
          tag: "CANNOT START YET",
          link: undefined,
          status: 0
        },
        {
          title: "Other accountable persons",
          tag: "CANNOT START YET",
          link: undefined,
          status: 0
        },
      ]
    },
    {
      title: "Submit your application",
      items: [
        {
          title: "Apply and pay the fee",
          tag: "CANNOT START YET",
          link: undefined,
          status: 0
        }
      ]
    }
  ]
}
