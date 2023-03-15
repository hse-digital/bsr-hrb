import { Component, QueryList, ViewChildren } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { ApAddressComponent } from "../ap-address/ap-address.component";

@Component({
  templateUrl: './principal.component.html'
})
export class PrincipleAccountableSelection extends BaseComponent implements IHasNextPage {
  static route: string = 'principal';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  principalHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: Title) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

    canContinue(): boolean {
        this.principalHasErrors = !this.applicationService.currentAccountablePerson.IsPrincipal;
        return !this.principalHasErrors;
    }
     
    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        return navigationService.navigateRelative(ApAddressComponent.route, activatedRoute);
    }
}
