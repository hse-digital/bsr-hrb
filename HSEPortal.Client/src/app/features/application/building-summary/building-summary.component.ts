import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";

@Component({
    template: '<router-outlet></router-outlet>'
})
export class BuildingSummaryComponent {
    constructor(private activatedRoute: ActivatedRoute, private applicationService: ApplicationService) {
        this.activatedRoute.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.applicationService.selectSection(id);
            }
        });
    }
}