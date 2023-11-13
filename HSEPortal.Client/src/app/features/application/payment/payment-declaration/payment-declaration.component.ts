import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStage } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentSelectionComponent } from '../payment-selection/payment-selection.component';

@Component({
  selector: 'hse-payment-declaration',
  templateUrl: './payment-declaration.component.html'
})
export class PaymentDeclarationComponent extends PageComponent<void> {
  static route: string = 'declaration';
  static title: string = "Registration declaration - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute, private paymentService: PaymentService) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.ApplicationStatus = applicationService.model.ApplicationStatus | BuildingApplicationStage.PaymentInProgress;
    await this.applicationService.updateApplication();
  }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue: boolean): Promise<void> {
    await this.applicationService.syncDeclaration();
  }

  override canAccess(_: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return ((this.applicationService.model.ApplicationStatus & BuildingApplicationStage.AccountablePersonsComplete) == BuildingApplicationStage.AccountablePersonsComplete)
      && ((this.applicationService.model.ApplicationStatus & BuildingApplicationStage.BlocksInBuildingComplete) == BuildingApplicationStage.BlocksInBuildingComplete);
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(PaymentSelectionComponent.route, this.activatedRoute);
  }
  
  isPapRegisteringFor() {
    return this.applicationService.currentVersion.AccountablePersons[0].Role == "registering_for";
  }
}
