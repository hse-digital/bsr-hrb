import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService } from '../../../../services/application.service';

@Component({
  selector: 'hse-block-name',
  templateUrl: './block-name.component.html'
})
export class BlockNameComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'floors-above';

  building: { blockName?: string } = {}
  blockNameHasErrors = false;
  private blockId!: string;

  constructor(router: Router,  private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('floors-above', activatedRoute);
  }

  canContinue(): boolean {
    this.blockNameHasErrors = !this.applicationService.currentBlock.name;
    return !this.blockNameHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }
}
