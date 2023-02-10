import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from '../../../../../services/application.service';
import { CaptionService } from '../../../../../services/caption.service';

@Component({
  selector: 'hse-another-block',
  templateUrl: './another-block.component.html',
  styleUrls: ['./another-block.component.scss']
})
export class AnotherBlockComponent extends BaseComponent {
  static route: string = 'another-block'
  private blockId!: string;

  constructor(router: Router, activatedRoute: ActivatedRoute, private captionService: CaptionService, private applicationService: ApplicationService) {
    super(router, activatedRoute);
    this.blockId = this.getURLParam('blockId');
  }

  anotherBlockHasErrors = false;
  building: { anotherBlock?: string } = {}
  nextScreenRoute: string = "";
  private nextScreenRouteWhenYes: string = "../floors-above";
  private nextScreenRouteWhenNo: string = "../check-answers";

  canContinue(): boolean {
    this.anotherBlockHasErrors = !this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.AnotherBlock;
    this.setNextScreenRoute(this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.AnotherBlock ?? '');

    return !this.anotherBlockHasErrors;
  }

  updateAnotherBlock(anotherBlock: string) {
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if (block) block.AnotherBlock = anotherBlock;
  }

  setNextScreenRoute(anotherBlock: string) {
    if (this.anotherBlockHasErrors) return;
    this.nextScreenRoute = anotherBlock === "yes"
      ? this.nextScreenRouteWhenYes
      : this.nextScreenRouteWhenNo;
  }

  override async saveAndContinue() {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      await this.applicationService.registerNewBuildingApplication();
      this.router.navigate([this.nextScreenRoute], { relativeTo: this.activatedRoute })
    }
  }

  get blockNames(): string | undefined {
    let blockNames = this.applicationService.model.Blocks?.map(x => x.BlockName);
    if (blockNames) return blockNames.reduce((name, current) => current + ", " + name);
    return undefined;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

}
