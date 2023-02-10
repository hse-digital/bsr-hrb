import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { CaptionService } from 'src/app/services/caption.service';
import { ApplicationService } from '../../../../../services/application.service';

@Component({
  selector: 'hse-block-name',
  templateUrl: './block-name.component.html'
})
export class BlockNameComponent extends BaseComponent {

  static route: string = 'floors-above';

  nextScreenRoute: string = '';
  building: { blockName ?: string } = {}
  blockNameHasErrors = false;
  private blockId!: string;

  constructor(router: Router, activatedRoute: ActivatedRoute, private captionService: CaptionService, private applicationService: ApplicationService) {
    super(router, activatedRoute);
    this.blockId = this.getURLParam('blockId');
  }

  canContinue(): boolean {
    this.blockNameHasErrors = !this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.BlockName;
    return !this.blockNameHasErrors;
  }

  override navigateNextScreenRoute() {
    this.router.navigate(['../floors-above'], { relativeTo: this.activatedRoute })
  }

  updateBlockName(blockName: string) {
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if (block) block.BlockName = blockName;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }
}
