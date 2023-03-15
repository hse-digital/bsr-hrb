import { Component, QueryList, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './contact-name.component.html'
})
export class ContactNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = "contact-name";
  static title: string = "Your name - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: Title) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
    this.updateOnSave = false;
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.applicationService.model.ContactFirstName;
    this.lastNameInError = !this.applicationService.model.ContactLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot){
    return !!this.applicationService.model.BuildingName;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('contact-phone', activatedRoute);
  }
}
