import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-name',
  templateUrl: './name.component.html'
})
export class NameComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'name';

  blockNameHasErrors = false;

  constructor(router: Router,  private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('floors-above', activatedRoute);
  }

  public canContinue(): boolean {
    this.blockNameHasErrors = !this.applicationService.currentBlock.Name;
    return !this.blockNameHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }
}
