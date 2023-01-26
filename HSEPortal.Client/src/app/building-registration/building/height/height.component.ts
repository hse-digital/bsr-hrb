import { Component } from "@angular/core";

@Component({
    templateUrl: './height.component.html'
})
export class BuildingHeightComponent {

    building: { height?: number } = {};
    showError = false;

    updateErrorStatus() {
        this.showError = !this.building.height;
    }

    getErrorText() {
        return this.showError && !this.building.height
            ? 'Enter the block height in metres'
            : undefined;
    }

    getContinueLink() {
        return !this.showError && this.building.height
          ? '/building-registration/building/height'
          : undefined;
    }
}