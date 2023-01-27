import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BaseFormComponent } from "src/app/helpers/base-form.component";

@Component({
    templateUrl: './height.component.html'
})
export class BuildingHeightComponent extends BaseFormComponent {
    // 'Enter the block height in metres'

    constructor(router: Router) {
        super(router);
    }

    nextScreenRoute: string = '/building-registration/building/residential-units';
    building: { height?: number } = {};
    heightHasErrors = false;

    errorSummaryMessage: string = 'You must enter the height of this block from ground level to the top floor in metres';
    errorMessage: string = 'Enter the block height in metres';

    canContinue(): boolean {
        this.heightHasErrors = true;

        if (!this.building.height || !Number(this.building.height)) {
            this.errorMessage = 'Enter the block height in metres';
            this.errorSummaryMessage = 'You must enter the height of this block from ground level to the top floor in metres';
        } else if (this.building.height >= 1000) {
            this.errorSummaryMessage = this.errorMessage = 'Block height in metres must be 999.9 or less';
        } else if (this.building.height < 3) {
            this.errorSummaryMessage = this.errorMessage = 'Block height in metres must be more than 2';
        } else {
            this.heightHasErrors = false;
        }

        return !this.heightHasErrors;
    }
}