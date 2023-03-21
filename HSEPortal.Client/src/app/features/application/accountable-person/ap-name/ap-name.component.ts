import { AfterViewInit, Component, Input, QueryList, ViewChildren } from "@angular/core";
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, Router } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { ApDetailsComponent } from "../ap-details/ap-details.component";
import { PapNameComponent } from "./pap-name.component";

@Component({
  selector: 'ap-name',
  templateUrl: './ap-name.component.html'
})
export class ApNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'name';
  static title: string = "AP individual name - Register a high-rise building - GOV.UK";

  @Input() pap: boolean = false;
  @Input() nextRoute?: string;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.applicationService.currentAccountablePerson.FirstName;
    this.lastNameInError = !this.applicationService.currentAccountablePerson.LastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(this.nextRoute ?? ApDetailsComponent.route, activatedRoute);
  }
}
