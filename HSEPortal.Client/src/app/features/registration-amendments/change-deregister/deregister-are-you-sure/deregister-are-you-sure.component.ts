import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStatuscode, OutOfScopeReason } from 'src/app/services/application.service';
import { SectionHeightComponent } from 'src/app/features/application/building-summary/height/height.component';
import { SectionResidentialUnitsComponent } from 'src/app/features/application/building-summary/residential-units/residential-units.component';
import { SectionPeopleLivingInBuildingComponent } from 'src/app/features/application/building-summary/people-living-in-building/people-living-in-building.component';
import { ApplicationCompletedComponent } from 'src/app/features/application/application-completed/application-completed.component';
import { DeregisterWhyComponent } from '../deregister-why/deregister-why.component';
import { DeregisterApplicationNumberComponent } from '../deregister-application-number/deregister-application-number.component';

@Component({
  selector: 'hse-deregister-are-you-sure',
  templateUrl: './deregister-are-you-sure.component.html'
})
export class DeregisterAreYouSureComponent  extends PageComponent<string> {
  static route: string = 'deregister-are-you-sure';
  static title: string = "Confirm you want to remove this building - Register a high-rise building - GOV.UK";

  isAppAccepted?: boolean;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.isAppAccepted = await this.isApplicationAccepted();
    this.initDeregister();
  }

  initDeregister() {
    if (!this.applicationService.model.RegistrationAmendmentsModel!.Deregister) {
      this.applicationService.model.RegistrationAmendmentsModel!.Deregister = {}
    }
    this.model = this.applicationService.model.RegistrationAmendmentsModel?.Deregister.AreYouSure;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.RegistrationAmendmentsModel!.Deregister!.AreYouSure = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    let isOutOfScope = this.applicationService.currentChangedSection.SectionModel?.Scope?.IsOutOfScope;
    if(this.model == 'no') {
      let outOfScopeRoute = this.getNextOutOfScopeRoute(this.applicationService.currentChangedSection.SectionModel?.Scope?.OutOfScopeReason);
      if (isOutOfScope && FieldValidations.IsNotNullOrWhitespace(outOfScopeRoute)) {
        this.applicationService.currentChangedSection.SectionModel!.Scope = {};
        return this.navigateToSectionPage(outOfScopeRoute);
      } else {
        return this.navigationService.navigateRelative(`../${ApplicationCompletedComponent.route}`, this.activatedRoute);
      }
    } else {
      let nextRoute = isOutOfScope ? DeregisterApplicationNumberComponent.route : DeregisterWhyComponent.route;
      return this.navigationService.navigateRelative(nextRoute, this.activatedRoute);
    }
  }

  navigateToSectionPage(url: string, query?: string) {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentChange = url;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentSectionIndex = this.applicationService._currentSectionIndex;
    this.applicationService.updateApplication();
    return this.navigationService.navigateRelative(`../sections/section-${this.applicationService._currentSectionIndex + 1}/${url}`, this.activatedRoute);
  }

  private getNextOutOfScopeRoute(outOfScopeReason?: OutOfScopeReason) {
    switch(outOfScopeReason) {
      case OutOfScopeReason.Height: return SectionHeightComponent.route;
      case OutOfScopeReason.NumberResidentialUnits: return SectionResidentialUnitsComponent.route;
      case OutOfScopeReason.PeopleLivingInBuilding: return SectionPeopleLivingInBuildingComponent.route;
    }
    return ""
  }

  get errorMessage() {
    return `Select yes to confirm you want to remove ${this.applicationService.model.BuildingName}`;
  }

  async isApplicationAccepted() {
    let statuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
    return statuscode == BuildingApplicationStatuscode.Registered || statuscode == BuildingApplicationStatuscode.RegisteredKbiValidated;
  }

}
