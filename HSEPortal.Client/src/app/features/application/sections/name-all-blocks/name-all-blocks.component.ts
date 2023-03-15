import { Component, QueryList, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-name-all-blocks',
  templateUrl: './name-all-blocks.component.html'
})
export class NameAllBlocksComponent extends BaseComponent implements IHasNextPage{
  static route: string = 'name-all-blocks';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
    static title: string | undefined;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: Title) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigateRelative(`../accountable-person`, activatedRoute);
  }
}
