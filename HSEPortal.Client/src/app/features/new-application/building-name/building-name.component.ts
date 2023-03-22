import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

@Component({
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = "building-name";
  static title: string = "Building name - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, registrationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, registrationService, navigationService, activatedRoute, titleService);
    this.updateOnSave = false;
  }

  nameHasErrors: boolean = false;
  canContinue(): boolean {
    this.nameHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.BuildingName);    
    return !this.nameHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('contact-name', activatedRoute);
  }
}
