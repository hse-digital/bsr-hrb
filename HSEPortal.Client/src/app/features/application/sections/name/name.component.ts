import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService } from 'src/app/services/application.service';
import { SectionFloorsAboveComponent } from '../floors-above/floors-above.component';
import { GovukErrorSummaryComponent } from 'hse-angular';

@Component({
  templateUrl: './name.component.html'
})
export class SectionNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'name';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  blockNameHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionFloorsAboveComponent.route, activatedRoute);
  }

  public canContinue(): boolean {
    this.blockNameHasErrors = !this.applicationService.currentSection?.Name;
    return !this.blockNameHasErrors;
  }
}
