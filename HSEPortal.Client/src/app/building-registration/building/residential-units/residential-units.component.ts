import { Component } from "@angular/core";

@Component({
    templateUrl: './residential-units.component.html'
})
export class ResidentialUnitsComponent {

    building: { residentialUnits?: number } = {};
    showError = false;

    updateErrorStatus() {
        this.showError = !this.building.residentialUnits;
    }

    getErrorText() {
        return this.showError && !this.building.residentialUnits
            ? 'Enter the number of residential units in this block'
            : undefined;
    }

    getContinueLink() {
        return !this.showError && this.building.residentialUnits
          ? '/building-registration/building/residential-units'
          : undefined;
    }
}