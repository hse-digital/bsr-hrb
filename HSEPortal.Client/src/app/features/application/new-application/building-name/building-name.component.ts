import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = "building-name";

  constructor(router: Router, registrationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, registrationService, navigationService, activatedRoute);
  }

  nameHasErrors: boolean = false;
  canContinue(): boolean {
    this.nameHasErrors = !this.applicationService.model.BuildingName;
    return !this.nameHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('contact-name', activatedRoute);
  }
}
