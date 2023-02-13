import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService } from '../../../../services/application.service';

@Component({
  selector: 'hse-block-name',
  templateUrl: './block-name.component.html'
})
export class BlockNameComponent extends BaseComponent {

  static route: string = 'floors-above';

  nextScreenRoute: string = '';
  building: { blockName?: string } = {}
  blockNameHasErrors = false;
  private blockId!: string;

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.blockNameHasErrors = !this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.BlockName;
    return !this.blockNameHasErrors;
  }

  updateBlockName(blockName: string) {
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if (block) block.BlockName = blockName;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }
}
