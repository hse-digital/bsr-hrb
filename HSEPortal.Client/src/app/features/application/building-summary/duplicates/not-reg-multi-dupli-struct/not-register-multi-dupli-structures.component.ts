import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-not-need-register-multi-duplicated-structures',
  templateUrl: './not-register-multi-dupli-structures.component.html'
})
export class NotNeedRegisterMultiDuplicatedStructuresComponent extends PageComponent<void> {
  static route: string = 'not-need-register-multi-duplicated-structures';
  static title: string = "You do not need to register this building - Register a high-rise building - GOV.UK";
  
  override async onInit(applicationService: ApplicationService): Promise<void> { }
  
  override onSave(applicationService: ApplicationService): void | Promise<void> { }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }
  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> { }

  async newApplication() {
    await this.navigationService.navigate('/select');
  }
}
