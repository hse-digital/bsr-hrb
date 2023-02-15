import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-name-all-blocks',
  templateUrl: './name-all-blocks.component.html',
  styleUrls: ['./name-all-blocks.component.scss']
})
export class NameAllBlocksComponent extends BaseComponent implements IHasNextPage{
  static route: string = 'name-all-blocks';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    this.applicationService.model.AccountablePersons = [];
    let accountablePersonId = this.applicationService.initializeNewAccountablePerson();
    let route = `../../accountable-person/${accountablePersonId}/accountable-person`;
    return this.navigationService.navigateRelative(route, activatedRoute);
  }
}
