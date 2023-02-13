import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from '../../../../../helpers/has-next-page.interface';

@Component({
  selector: 'hse-number-blocks-building',
  templateUrl: './number-blocks-building.component.html',
})
export class NumberBlocksBuildingComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'number-blocks-building'

  numberBlocksHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, private captionService: CaptionService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.numberBlocksHasErrors = !this.applicationService.model.NumberBlocksBuilding;
    return !this.numberBlocksHasErrors;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('floors-above', activatedRoute);
  }

  radioModelHasChanged(event: any) {
    this.setCaptionText();
  }

  setCaptionText() {
    this.captionService.caption = this.applicationService.model.NumberBlocksBuilding === 'one'
      ? "Blocks in the building"
      : "First block in the building";
  }

}
