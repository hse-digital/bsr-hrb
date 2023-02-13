import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';

@Component({
  selector: 'hse-another-block',
  templateUrl: './another-block.component.html',
  styleUrls: ['./another-block.component.scss']
})
export class AnotherBlockComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'another-block'

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  anotherBlockHasErrors = false;

  canContinue(): boolean {
    this.anotherBlockHasErrors = !this.applicationService.currentBlock.AnotherBlock;
    return !this.anotherBlockHasErrors;
  }

  get blockNames(): string | undefined {
    let blockNames = this.applicationService.model.Blocks?.map(x => x.Name);
    if (blockNames) return blockNames.reduce((name, current) => current + ", " + name);
    return undefined;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentBlock.PeopleLivingInBuilding;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextScreenRoute = this.getNextScreenRoute();
    return navigationService.navigateRelative(nextScreenRoute, activatedRoute);
  }

  getNextScreenRoute(): string {
    return this.applicationService.currentBlock.AnotherBlock === "yes"
      ? "floors-above"
      : "check-answers";
  }
}
