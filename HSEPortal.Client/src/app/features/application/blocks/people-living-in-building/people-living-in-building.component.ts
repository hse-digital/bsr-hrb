import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { CaptionService } from "src/app/services/caption.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";

@Component({
  templateUrl: './people-living-in-building.component.html'
})
export class PeopleLivingInBuildingComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'people-living-in-building';

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  peopleLivingHasErrors = false;

  canContinue(): boolean {
    let peopleLivingInBuilding = this.applicationService.currentBlock.PeopleLivingInBuilding;
    this.peopleLivingHasErrors = !peopleLivingInBuilding;
    return !this.peopleLivingHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentBlock.ResidentialUnits;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('another-block', activatedRoute);
  }
}
