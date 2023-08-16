import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { CertificatesYearChangeComponent } from '../certificates-year-change/certificates-year-change.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-previous-use-building',
  templateUrl: './previous-use-building.component.html'
})
export class PreviousUseBuildingComponent extends PageComponent<string> {
  static route: string = 'previous-primary-use';
  static title: string = "Previous primary use - Register a high-rise building - GOV.UK";

  previousUseBuildingHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentKbiSection?.BuildingUse.PreviousUseBuilding;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.PreviousUseBuilding = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.BuildingUse.ChangePrimaryUse && this.applicationService.currentKbiSection?.BuildingUse.ChangePrimaryUse === "yes";
  }

  override isValid(): boolean {
    this.previousUseBuildingHasErrors = !this.model || this.model?.length == 0;
    return !this.previousUseBuildingHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(CertificatesYearChangeComponent.route, this.activatedRoute);
  }

  getErrorMessage() {
    return `Select the previous primary use of ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

}
