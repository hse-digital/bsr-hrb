import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { BlockRegistrationService } from 'src/app/services/block-registration.service';
import { CaptionService } from '../../../../../services/caption.service';

@Component({
  selector: 'hse-another-block',
  templateUrl: './another-block.component.html',
  styleUrls: ['./another-block.component.scss']
})
export class AnotherBlockComponent extends BaseComponent {

  constructor(router: Router, private captionService: CaptionService, private blockRegistrationService: BlockRegistrationService) {
    super(router);
  }

  building: { anotherBlock?: any } = {};
  anotherBlockHasErrors = false;

  nextScreenRoute: string = "";
  private nextScreenRouteWhenYes: string = "/building-registration/building/floors-above";
  private nextScreenRouteWhenNo: string = "/building-registration/building/check-answers";

  canContinue(): boolean {
    this.anotherBlockHasErrors = !this.building.anotherBlock;
    this.setNextScreenRoute();
    return !this.anotherBlockHasErrors;
  }

  setNextScreenRoute() {
    if (this.anotherBlockHasErrors) return;
    this.nextScreenRoute = this.building.anotherBlock === "yes"
      ? this.nextScreenRouteWhenYes
      : this.nextScreenRouteWhenNo;
  }

  override async saveAndContinue() {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      await this.blockRegistrationService.registerNewBlock();
      this.router.navigate([this.nextScreenRoute]);
    }
  }

  get blockNames(): string | undefined {
    return "[block A] and [block B]"
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

}
