import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';
import { ReturningApplicationComponent } from '../../returning-application/returning-application.component';
import { YesButNoReferenceComponent } from '../yes-but-no-reference/yes-but-no-reference';

@Component({
  selector: 'hse-what-want-to-do',
  templateUrl: './what-want-to-do.component.html'
})
export class WhatWantToDoComponent extends PageComponent<string> {
  static route: string = 'what-you-want-to-do';
  static title: string = "Application reference - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute, private kbiService: KbiService) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.applicationService.newApplication();
    this.applicationService.resetCurrentVersionIndex();
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
    if (this.model == 'register-building') {
      return this.navigationService.navigateRelative('/new-application/building-name', this.activatedRoute);
    }
    else if (this.model == 'yes-but-no-reference') {
      return this.navigationService.navigateRelative(YesButNoReferenceComponent.route, this.activatedRoute);
    }
    
    return this.navigationService.navigateRelative(ReturningApplicationComponent.route, this.activatedRoute);
  }

}
