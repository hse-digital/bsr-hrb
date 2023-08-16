import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';
import { ContactNameComponent } from '../contact-name/contact-name.component';
@Component({
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends PageComponent<string> {
  static route: string = "building-name";
  static title: string = "Building name - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
    this.updateOnSave = false;
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.model.BuildingName;
  }

  override onSave(applicationService: ApplicationService): void {
    this.applicationService.model.BuildingName = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    let isValid = FieldValidations.IsNotNullOrWhitespace(this.model);
    if (isValid) this.onSave(this.applicationService);
    return isValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ContactNameComponent.route, this.activatedRoute);
  }
}
