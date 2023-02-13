import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { CaptionService } from "src/app/services/caption.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  templateUrl: './height.component.html',
})
export class BuildingHeightComponent extends BaseComponent {

  static route: string = 'height';
  private blockId?: string;

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  nextScreenRoute: string = '';
  building: { height?: string } = {}
  heightHasErrors = false;

  errorSummaryMessage: string = 'You must enter the height of this block from ground level to the top floor in metres';
  errorMessage: string = 'Enter the block height in metres';

  canContinue(): boolean {
    this.heightHasErrors = true;
    let height = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.Height;

    if (!height || !Number(height)) {
      this.errorMessage = 'Enter the block height in metres';
      this.errorSummaryMessage = 'You must enter the height of this block from ground level to the top floor in metres';
    } else if (height >= 1000) {
      this.errorSummaryMessage = this.errorMessage = 'Block height in metres must be 999.9 or less';
    } else if (height < 3) {
      this.errorSummaryMessage = this.errorMessage = 'Block height in metres must be more than 2';
    } else {
      this.heightHasErrors = false;
    }

    return !this.heightHasErrors;
  }

  updateHeight(height: number) {
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if (block) block.Height = height;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return !!this.applicationService.model.Blocks?.find(x => x.BlockName === '')?.FloorsAbove;
  }
}
