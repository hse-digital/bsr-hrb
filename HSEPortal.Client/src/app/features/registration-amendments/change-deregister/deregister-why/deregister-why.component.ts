import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ChangeSection, ApplicationService, BuildingApplicationStatuscode } from 'src/app/services/application.service';

@Component({
  selector: 'hse-deregister-why',
  templateUrl: './deregister-why.component.html'
})
export class DeregisterWhyComponent extends PageComponent<string> {
  static route: string = 'deregister-why';
  static title: string = "Why do you want to withdraw this application? - Register a high-rise building - GOV.UK";

  isAppAccepted?: boolean;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.isAppAccepted = await this.isApplicationAccepted();
    this.model = this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.Why
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.RegistrationAmendmentsModel!.Deregister!.Why = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    return true;
  }

  async isApplicationAccepted() {
    let statuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
    return statuscode == BuildingApplicationStatuscode.Registered || statuscode == BuildingApplicationStatuscode.RegisteredKbiValidated;
  }

  isSingleStructure() {
    return this.applicationService.model.NumberOfSections == "one";
  }

  get movedOutOptionLabel() {
    return this.isSingleStructure() 
      ? "Everyone has moved out"
      : "Everyone has moved out of all of the structures";
  }

  get residentialUnitsOption() {
    return this.isSingleStructure() 
      ? "It now has less than 2 residential units"
      : "All of the structures now have less than 2 residential units";
  }

  get floorsHeightOption() {
    return this.isSingleStructure() 
      ? "It now has less than 7 floors and is less than 18 metres in height"
      : "All of the structures now have less than 7 floors and are less than 18 metres in height";
  }

  get title() {
    return this.isAppAccepted 
      ? `Why do you want to remove ${this.applicationService.model.BuildingName}?`
      : `Why do you want to withdraw the application for ${this.applicationService.model.BuildingName}?`;
  }

}
