import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "../../../../../services/application.service";
import { CaptionService } from "../../../../../services/caption.service";

@Component({
  templateUrl: './floors-above.component.html'
})
export class BuildingFloorsAboveComponent extends BaseComponent {

  static route: string = 'floors-above';
  private blockId!: string;  

  constructor(router: Router, activatedRoute: ActivatedRoute, private applicationService: ApplicationService, private captionService: CaptionService) {
    super(router, activatedRoute);
    this.blockId = this.getURLParam('blockId');
  }

  nextScreenRoute: string = '';
  building: { floorsAbove?: string } = {}
  floorsHasError = false;

  errorSummaryMessage: string = 'You must enter the number of floors above ground level for this block';
  errorMessage: string = 'Enter the number of floors above ground level for this block';

  canContinue(): boolean {
    this.floorsHasError = true;
    let floorsAbove = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.FloorsAbove;

    if (!floorsAbove || !Number(floorsAbove) || floorsAbove % 1 != 0) {
      this.errorMessage = 'Enter the number of floors above ground level for this block';
      this.errorSummaryMessage = 'You must enter the number of floors above ground level for this block';
    } else if (floorsAbove >= 1000) {
      this.errorSummaryMessage = 'Number of floors must be 999 or less';
      this.errorMessage = 'Enter a whole number below 999';
    } else if (floorsAbove < 1) {
      this.errorSummaryMessage = 'A block must have at least 1 floor including the ground floor';
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.floorsHasError = false;
    }

    return !this.floorsHasError;
  }

  override navigateNextScreenRoute() {
    this.router.navigate(['../height'], { relativeTo: this.activatedRoute })
  }

  updateFloorsAbove(floorsAbove: number) {
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if(block) block.FloorsAbove = floorsAbove;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  } 

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return !!this.applicationService.model.Blocks;
  }
}
