import { Component } from "@angular/core";

@Component({
    templateUrl: './floors-above.component.html'
})
export class FloorsAboveComponent {

    building: { floorsAbove?: number } = {};
    showError = false;

    updateErrorStatus() {
        this.showError = !this.building.floorsAbove;
    }

    getErrorText() {
        return this.showError && !this.building.floorsAbove
            ? 'Enter the number of floors above ground level for this block'
            : undefined;
    }
}