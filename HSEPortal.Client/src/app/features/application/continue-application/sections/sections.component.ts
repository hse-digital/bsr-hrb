import { Component, OnInit } from "@angular/core";
import { ApplicationService } from "src/app/services/application.service";

@Component({
  templateUrl: './sections.component.html'
})
export class ApplicationsSectionsComponent implements OnInit {
  static route: string = 'sections';

  constructor(public applicationService: ApplicationService) {

  }

  ngOnInit(): void {
    if (!this.applicationService.model.BuildingName)
      window.location.href = window.location.href;
  }

  tasks = [
    {
      title: "Prepare your application",
      items: [
        {
          title: "Blocks in the building",
          tag: "NOT STARTED YET",
          link: `/application/${this.applicationService.model.id}/complex-structure`,
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
