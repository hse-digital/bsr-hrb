import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BaseFormComponent } from "src/app/helpers/base-form.component";
import { BlockRegistrationService } from "../../../services/building-registration/block-registration.service";
import { CaptionService } from "../caption.service";

@Component({
  templateUrl: './residential-units.component.html'
})
export class ResidentialUnitsComponent extends BaseFormComponent {

  constructor(router: Router, private captionService: CaptionService, private blockRegistrationService: BlockRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/building/people-living-in-building';
  building: { residentialUnits?: number } = {};
  residentialUnitsHasErrors = false;

  errorSummaryMessage: string = 'You must enter the number of residential units in this block';
  errorMessage: string = 'Enter the number of residential units in this block';

  canContinue(): boolean {
    this.residentialUnitsHasErrors = true;

    var residentialUnits = Number(this.building.residentialUnits);
    if (!this.building.residentialUnits) {
      this.errorMessage = 'Enter the number of residential units in this block';
      this.errorSummaryMessage = 'You must enter the number of residential units in this block';
    } else if (!Number.isInteger(residentialUnits) || this.building.residentialUnits % 1 != 0 || residentialUnits < 0) {
      this.errorSummaryMessage = this.errorMessage = 'Number of residential units must be a whole number';
    } else if (this.building.residentialUnits >= 10000) {
      this.errorSummaryMessage = this.errorMessage = 'Number of residential units must be 9999 or less';
    } else {
      this.residentialUnitsHasErrors = false;
    }

    return !this.residentialUnitsHasErrors;
  }

  updateNumberResidentialUnits(numberResidentialUnits: number) {
    this.blockRegistrationService.setResidentialUnits(numberResidentialUnits);
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }
}
