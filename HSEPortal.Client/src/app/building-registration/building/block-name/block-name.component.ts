import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../helpers/base-form.component';
import { BlockRegistrationService } from '../../../services/building-registration/block-registration.service';
import { CaptionService } from '../caption.service';

@Component({
  selector: 'hse-block-name',
  templateUrl: './block-name.component.html'
})
export class BlockNameComponent extends BaseFormComponent {

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
