import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { AddAccountablePersonComponent } from '../../application/accountable-person/add-accountable-person/add-accountable-person.component';

@Component({
  selector: 'hse-evacuation-strategy',
  templateUrl: './evacuation-strategy.component.html',
  styleUrls: ['./evacuation-strategy.component.scss']
})
export class EvacuationStrategyComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'pap-named-role';
  static title: string = "What is your job role at PAP organisation? - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  evacuationStrategyHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    this.evacuationStrategyHasErrors = !this.applicationService.model.Kbi?.strategyEvacuateBuilding ?? true;
    return !this.evacuationStrategyHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(EvacuationStrategyComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }
}