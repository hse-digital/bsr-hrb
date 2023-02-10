import { Component } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from '../../../../../services/application.service';
import { CaptionService } from '../../../../../services/caption.service';

@Component({
  selector: 'hse-number-blocks-building',
  templateUrl: './number-blocks-building.component.html',
})
export class NumberBlocksBuildingComponent extends BaseComponent {
  static route: string = ''
  private blockId!: string;

  constructor(router: Router, private applicationService: ApplicationService, private captionService: CaptionService) {
    super(router);
    this.blockId = this.getURLParam('blockId');
  }

  nextScreenRoute: string = '/building-registration/building/floors-above';
  building: { numberBlocks?: string } = {}
  numberBlocksHasErrors = false;

  updateNumberBlocksBuilding(numberBlockBuilding: string) {
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if (block) block.NumberBlocksBuilding = numberBlockBuilding;

    this.captionService.caption = numberBlockBuilding === 'one'
      ? "Blocks in the building"
      : "First block in the building";
  }

  canContinue(): boolean {
    this.numberBlocksHasErrors = !this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.NumberBlocksBuilding;
    return !this.numberBlocksHasErrors;
  }
}
