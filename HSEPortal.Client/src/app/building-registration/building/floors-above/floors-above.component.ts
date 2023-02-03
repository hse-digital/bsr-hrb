import { AfterContentInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { BaseFormComponent } from "src/app/helpers/base-form.component";
import { BlockRegistrationService } from "../../../services/building-registration/block-registration.service";
import { CaptionService } from "../caption.service";

@Component({
  templateUrl: './floors-above.component.html'
})
export class BuildingFloorsAboveComponent extends BaseFormComponent {

  constructor(router: Router, private blockRegistrationService: BlockRegistrationService, private captionService: CaptionService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/building/height';
  building: { floorsAbove?: number } = {};
  floorsHasError = false;

  errorSummaryMessage: string = 'You must enter the number of floors above ground level for this block';
  errorMessage: string = 'Enter the number of floors above ground level for this block';

  canContinue(): boolean {
    this.floorsHasError = true;

    if (!this.building.floorsAbove || !Number(this.building.floorsAbove) || this.building.floorsAbove % 1 != 0) {
      this.errorMessage = 'Enter the number of floors above ground level for this block';
      this.errorSummaryMessage = 'You must enter the number of floors above ground level for this block';
    } else if (this.building.floorsAbove >= 1000) {
      this.errorSummaryMessage = 'Number of floors must be 999 or less';
      this.errorMessage = 'Enter a whole number below 999';
    } else if (this.building.floorsAbove < 1) {
      this.errorSummaryMessage = 'A block must have at least 1 floor including the ground floor';
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.floorsHasError = false;
    }

    return !this.floorsHasError;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  } 
}
