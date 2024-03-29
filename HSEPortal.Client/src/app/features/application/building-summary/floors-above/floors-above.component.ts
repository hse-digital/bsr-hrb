import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";
import { SectionHelper } from "src/app/helpers/section-helper";
import { PageComponent } from "src/app/helpers/page.component";

@Component({
  templateUrl: './floors-above.component.html'
})
export class SectionFloorsAboveComponent extends PageComponent<number> {
  static route: string = 'floors';
  static title: string = "Number of floors at or above ground level in the section - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  errorMessage: string = 'Enter the number of floors at or above ground level';

  floorsHasError = false;

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.FloorsAbove;
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.FloorsAbove = this.model;
  }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }
  
  override isValid(): boolean {
    this.floorsHasError = true;
    let floorsAbove = this.model;

    if (!floorsAbove || !Number(floorsAbove) || floorsAbove % 1 != 0) {
      this.errorMessage = 'Enter the number of floors at or above ground level';
    } else if (floorsAbove >= 1000) {
      this.errorMessage = 'Enter a whole number below 999';
    } else if (floorsAbove < 1) {
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.floorsHasError = false;
    }

    return !this.floorsHasError;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative('height', this.activatedRoute);
  }

}
