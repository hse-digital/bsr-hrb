import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService } from 'src/app/services/application.service';
import { SectionFloorsAboveComponent } from '../floors-above/floors-above.component';

@Component({
  templateUrl: './name.component.html'
})
export class SectionNameComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'name';

  blockNameHasErrors = false;
  constructor(router: Router,  private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionFloorsAboveComponent.route, activatedRoute);
  }

  public canContinue(): boolean {
    this.blockNameHasErrors = !this.applicationService.currentSection.Name;
    return !this.blockNameHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }
}
