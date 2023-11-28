import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { RaDeclarationComponent } from '../ra-declaration/ra-declaration.component';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';
import { RaCheckAnswersUsersHelper } from './ra-check-answers-users.component';
import { ChangeKbiHelper } from 'src/app/helpers/registration-amendments/change-kbi-helper';
import { ChangeConnectionsHelper } from 'src/app/helpers/registration-amendments/change-connections-helper';

@Component({
  selector: 'hse-ra-check-answers',
  templateUrl: './ra-check-answers.component.html',
  styles: ['.govuk-summary-list__key { width:20%!important; }', '.govuk-summary-list__actions { width:10%!important; }', ]
})
export class RaCheckAnswersComponent extends PageComponent<void> {
  static route: string = 'check-answers';
  static title: string = "Changes you're making - Register a high-rise building - GOV.UK";

  override onInit(applicationService: ApplicationService): void | Promise<void> { 
  } 

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> { }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(RaDeclarationComponent.route, this.activatedRoute);
  }

  get numberOfChanges() {
    return this.numberOfBuildingChanges + this.numberOfUserChanges + this.numberOfKbiChanges + this.numberOfConnectionsChanges;
  }

  get numberOfBuildingChanges() {
    return new ChangeBuildingSummaryHelper(this.applicationService).getChanges().length;
  }

  get numberOfUserChanges() {
    return new RaCheckAnswersUsersHelper(this.applicationService).numberOfUserChanges;
  }

  get numberOfKbiChanges() {
    return new ChangeKbiHelper(this.applicationService).getChanges().length;
  }

  get numberOfConnectionsChanges() {
    return new ChangeConnectionsHelper(this.applicationService).getChanges().length;
  }

}
