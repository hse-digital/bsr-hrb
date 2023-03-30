import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { RoofInsulationComponent } from '../roof-insulation/roof-insulation.component';

@Component({
  selector: 'hse-roof-type',
  templateUrl: './roof-type.component.html'
})
export class RoofTypeComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'roof-type';
  static title: string = "Roof type - Register a high-rise building - GOV.UK";

  roofTypeHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, public kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    this.roofTypeHasErrors = !this.kbiService.model.roofType;
    return !this.roofTypeHasErrors;
  }

  override async saveAndContinue(): Promise<any> {
    this.processing = true;

    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.screenReaderNotification();

      await this.onSave();

      var hasNextPage = <IHasNextPage><unknown>this;
      if (hasNextPage) {
        await hasNextPage.navigateToNextPage(this.navigationService, this.activatedRoute);
      }
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }

    this.processing = false;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(RoofInsulationComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }
}
