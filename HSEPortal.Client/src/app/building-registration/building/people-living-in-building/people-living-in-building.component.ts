import { Component } from "@angular/core";

@Component({
    templateUrl: './people-living-in-building.component.html'
})
export class PeopleLivingInBuildingComponent {

    building: { peopleLivingInBuilding?: any } = {};
    showError = false;

    updateErrorStatus() {
        this.showError = !this.building.peopleLivingInBuilding;
    }

    getErrorText() {
        return this.showError && !this.building.peopleLivingInBuilding
            ? 'Select if people are living in the block or not'
            : undefined;
    }

    getContinueLink() {
        return !this.showError && this.building.peopleLivingInBuilding
          ? '/building-registration/building/people-living-in-building'
          : undefined;
    }
}