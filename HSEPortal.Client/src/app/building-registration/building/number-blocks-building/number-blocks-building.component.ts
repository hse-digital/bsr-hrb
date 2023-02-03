import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../helpers/base-form.component';
import { BlockRegistrationService } from '../../../services/building-registration/block-registration.service';
import { CaptionService } from '../caption.service';

@Component({
  selector: 'hse-number-blocks-building',
  templateUrl: './number-blocks-building.component.html',
})
export class NumberBlocksBuildingComponent extends BaseFormComponent {

  constructor(router: Router, private blockRegistrationService: BlockRegistrationService, private captionService: CaptionService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/building/floors-above';
  building: { numberBlocksBuilding?: any } = {};
  numberBlocksHasErrors = false;

  updateNumberBlocksBuilding(numberBlockBuilding: string) {
    this.blockRegistrationService.setNumberBlockBuilding(numberBlockBuilding);
    this.captionService.caption = numberBlockBuilding === 'one'
      ? "Blocks in the building"
      : "First block in the building";
  }

  canContinue(): boolean {
    this.numberBlocksHasErrors = !this.building.numberBlocksBuilding;
    return !this.numberBlocksHasErrors;
  }
}
