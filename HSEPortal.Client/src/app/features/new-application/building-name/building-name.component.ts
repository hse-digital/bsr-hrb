import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';
import { ContactNameComponent } from '../contact-name/contact-name.component';

@Component({
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends PageComponent<string> {
  static route: string = "building-name";
  static title: string = "Building name - Register a high-rise building - GOV.UK";

  override onInit(): void {
    this.model = this.applicationService.model.BuildingName;
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.BuildingName = this.model!;
  }

  override canAccess(_: ActivatedRouteSnapshot): boolean {
    return true;
  }

  nameHasErrors: boolean = false;
  override isValid(): boolean {
    this.nameHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model);
    return !this.nameHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ContactNameComponent.route, this.activatedRoute);
  }
}
