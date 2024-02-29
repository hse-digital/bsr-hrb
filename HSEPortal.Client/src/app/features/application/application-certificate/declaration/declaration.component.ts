import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { ChoosePaymentComponent } from '../choose-payment/choose-payment.component';

@Component({
  selector: 'hse-declaration',
  templateUrl: './declaration.component.html'
})
export class DeclarationComponent extends PageComponent<void> {
  static route: string = 'declaration';
  static title: string = "Building assessment certificate application declaration - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    // this.applicationService.model.ApplicationCertificate!.ApplicationStatus = applicationService.model.ApplicationCertificate!.ApplicationStatus | ApplicationCertificateStage.PaymentInProgress;
    await this.applicationService.updateApplication();
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    await this.applicationService.syncCertificateDeclaration();
  }

  override canAccess(_: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return true;
    // return ((this.applicationService.model.ApplicationStatus & BuildingApplicationStage.AccountablePersonsComplete) == BuildingApplicationStage.AccountablePersonsComplete)
    //   && ((this.applicationService.model.ApplicationStatus & BuildingApplicationStage.BlocksInBuildingComplete) == BuildingApplicationStage.BlocksInBuildingComplete);
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ChoosePaymentComponent.route, this.activatedRoute);
  }
}
