import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { BlockRegistrationService } from 'src/app/services/block-registration.service';
import { CaptionService } from '../../../../../services/caption.service';

@Component({
  selector: 'hse-number-blocks-building',
  templateUrl: './number-blocks-building.component.html',
})
export class NumberBlocksBuildingComponent extends BaseComponent {

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
