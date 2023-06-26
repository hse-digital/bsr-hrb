import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";

@Component({
  template: '<router-outlet></router-outlet>'
})
export class KbiSectionsComponent {
  constructor(private activatedRoute: ActivatedRoute, private applicationService: ApplicationService) {
    this.activatedRoute.params.subscribe(params => {
      let section = params['section'];
      if (section) {
        let sectionIndex = section.split('-')[0] - 1;
        this.applicationService._currentKbiSectionIndex = sectionIndex;
        this.applicationService._currentSectionIndex = sectionIndex;
      }
    });
  }
}