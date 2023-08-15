import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-why-continue-register',
  templateUrl: './why-continue-register.component.html'
})
export class WhyContinueRegisterComponent extends PageComponent<string> {
  static route: string = "why-continue";
  static title: string = "Why do you want to continue? - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if(!this.applicationService.currentSection.Duplicate) {
      this.applicationService.currentSection.Duplicate = {WhyContinue: ""}
    }
    this.model = this.applicationService.currentSection.Duplicate.WhyContinue;
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
    this.applicationService.currentSection.Duplicate!.WhyContinue = this.model;
  }

  override canAccess(applicationService: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {

  }

}
