import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';
import { ReturningApplicationComponent } from '../../returning-application/returning-application.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'hse-what-want-to-do',
  templateUrl: './what-want-to-do.component.html'
})
export class WhatWantToDoComponent extends PageComponent<string> {
  static route: string = environment.production ? "" : 'what-you-want-to-do';
  static title: string = "Select what you want to do - Register a high-rise building - GOV.UK";

  production = environment.production;


  constructor(activatedRoute: ActivatedRoute, private kbiService: KbiService) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.updateOnSave = false;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if(this.model == 'register-building') {
      return this.navigationService.navigateRelative('/select', this.activatedRoute);
    }
    return this.navigationService.navigateRelative(ReturningApplicationComponent.route, this.activatedRoute);;
  }

}
