import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BaseFormComponent } from "src/app/helpers/base-form.component";

@Component({
    templateUrl: './people-living-in-building.component.html'
})
export class PeopleLivingInBuildingComponent extends BaseFormComponent {

    constructor(router: Router) {
        super(router);
    }

    nextScreenRoute: string = '/building-registration/building/people-living-in-building';
    building: { peopleLivingInBuilding?: any } = {};
    peopleLivingHasErrors = false;

    canContinue(): boolean {
        this.peopleLivingHasErrors = !this.building.peopleLivingInBuilding;
        return !this.peopleLivingHasErrors;
    }
}