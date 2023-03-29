import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { KbiService } from 'src/app/services/kbi.service';

@Component({
  selector: 'hse-roof-material',
  templateUrl: './roof-material.component.html'
})
export class RoofMaterialComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'roof-material';
  static title: string = "Roof material - Register a high-rise building - GOV.UK";

  roofMaterialHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, public kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    this.roofMaterialHasErrors = !this.kbiService.model.roofMaterial;
    return !this.roofMaterialHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative("", activatedRoute);
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

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }
}