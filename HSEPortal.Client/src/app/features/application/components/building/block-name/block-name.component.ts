import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { BlockRegistrationService } from 'src/app/services/block-registration.service';
import { CaptionService } from 'src/app/services/caption.service';

@Component({
  selector: 'hse-block-name',
  templateUrl: './block-name.component.html'
})
export class BlockNameComponent extends BaseComponent {

  nextScreenRoute: string = '/building-registration/building/floors-above';
  building: { blockName?: string } = {}
  blockNameHasErrors = false;

  constructor(router: Router, private captionService: CaptionService, private blockRegistrationService: BlockRegistrationService) {
    super(router);
  }

  canContinue(): boolean {
    this.blockNameHasErrors = !this.building.blockName;
    return !this.blockNameHasErrors;
  }

  updateBlockName(blockName: string) {
    this.blockRegistrationService.setBlockName(blockName);
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }
}
