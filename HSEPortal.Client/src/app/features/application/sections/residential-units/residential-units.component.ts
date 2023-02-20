import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { CaptionService } from "src/app/services/caption.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionPeopleLivingInBuildingComponent } from "../people-living-in-building/people-living-in-building.component";

@Component({
  templateUrl: './residential-units.component.html'
})
export class SectionResidentialUnitsComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'residential-units';
  override updateOnSave: boolean = true;

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  residentialUnitsHasErrors = false;

  errorSummaryMessage: string = 'You must enter the number of residential units in this block';
  errorMessage: string = 'Enter the number of residential units in this block';

  canContinue(): boolean {
    this.residentialUnitsHasErrors = true;
    let residentialUnits = this.applicationService.currentSection.ResidentialUnits;

    if (!residentialUnits) {
      this.errorMessage = 'Enter the number of residential units in this block';
      this.errorSummaryMessage = 'You must enter the number of residential units in this block';
    } else if (!Number.isInteger(Number(residentialUnits)) || Number(residentialUnits) % 1 != 0 || Number(residentialUnits) < 0) {
      this.errorSummaryMessage = this.errorMessage = 'Number of residential units must be a whole number';
    } else if (residentialUnits >= 10000) {
      this.errorSummaryMessage = this.errorMessage = 'Number of residential units must be 9999 or less';
    } else {
      this.residentialUnitsHasErrors = false;
    }
    return !this.residentialUnitsHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.Height;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionPeopleLivingInBuildingComponent.route, activatedRoute);
  }
}
