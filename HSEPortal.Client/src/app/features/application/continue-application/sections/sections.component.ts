import { Component } from "@angular/core";
import { ApplicationService } from "src/app/services/application.service";

@Component({
  templateUrl: './sections.component.html'
})
export class ApplicationsSectionsComponent {
  static route: string = 'sections';

  constructor(public applicationService: ApplicationService) {

  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  tasks = [
    {
      title: "Prepare your application",
      items: [
        {
          title: "Blocks in the building",
          tag: "NOT STARTED YET",
          link: "/application/new/complex-structure",
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
