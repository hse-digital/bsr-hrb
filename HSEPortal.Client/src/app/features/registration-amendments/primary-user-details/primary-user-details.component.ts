import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-primary-user-details',
  templateUrl: './primary-user-details.component.html'
})
export class PrimaryUserDetailsComponent  extends PageComponent<string> {
  static route: string = 'user-list';
  static title: string = "Manage who can tell us about this building - Register a high-rise building - GOV.UK";

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    throw new Error('Method not implemented.');
  }
  override isValid(): boolean {
    throw new Error('Method not implemented.');
  }
  override navigateNext(): Promise<boolean | void> {
    throw new Error('Method not implemented.');
  }
}
