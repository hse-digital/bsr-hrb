import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStatuscode } from 'src/app/services/application.service';
import { RaDeclarationComponent } from '../../ra-declaration/ra-declaration.component';

@Component({
  selector: 'hse-deregister-application-number',
  templateUrl: './deregister-application-number.component.html'
})
export class DeregisterApplicationNumberComponent extends PageComponent<string> {
  static route: string = 'deregister-application-number';
  static title: string = "Confirm you want to withdraw this application - Register a high-rise building - GOV.UK";

  isAppAccepted?: boolean;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.isAppAccepted = await this.isApplicationAccepted();
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {

  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model) && this.model == this.applicationService.model.id;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(RaDeclarationComponent.route, this.activatedRoute);
  }


  get errorMessage() {
    return `Enter the application reference for ${this.applicationService.model.BuildingName}`;
  }

  async isApplicationAccepted() {
    let statuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
    return statuscode == BuildingApplicationStatuscode.Registered || statuscode == BuildingApplicationStatuscode.RegisteredKbiValidated;
  }

}
