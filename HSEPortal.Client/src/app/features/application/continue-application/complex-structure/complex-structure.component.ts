import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-complex-structure',
  templateUrl: './complex-structure.component.html',
  styleUrls: ['./complex-structure.component.scss']
})
export class ComplexStructureComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'complex-structure';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);

    // REMOVE
    this.applicationService.model.Blocks = [];
    // ######
  }

  canContinue(): boolean {
    return true;
  }

  continueLink = ''

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let blockId = this.applicationService.initializeNewBlock();
    let route = `../${this.applicationService.model.id}/blocks/${blockId}/${this.continueLink}`;
    return navigationService.navigateRelative(route, activatedRoute);
  }

}
