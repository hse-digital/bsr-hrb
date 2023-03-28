import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-payment-declaration',
  templateUrl: './payment-declaration.component.html'
})
export class PaymentDeclarationComponent extends BaseComponent implements OnInit {
  static route: string = 'declaration';
  static title: string = "Registration declaration - Register a high-rise building - GOV.UK";

  loading = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, public paymentService: PaymentService, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  async ngOnInit() {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.PaymentInProgress;
    await this.applicationService.updateApplication();
  }

  override async saveAndContinue() {
    this.loading = true;
    this.screenReaderNotification();

    await this.applicationService.syncDeclaration();
    var paymentResponse = await this.paymentService.InitialisePayment(this.applicationService.model);
    if (!this.applicationService.model.Payments) {
      this.applicationService.model.Payments = [];
    }

    this.applicationService.model.Payments.push(paymentResponse);
    this.applicationService.updateApplication();

    if (typeof window !== 'undefined') {
      window.location.href = paymentResponse.PaymentLink;
    }
  }

  canContinue(): boolean {
    return true;
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.AccountablePersonsComplete) == BuildingApplicationStatus.AccountablePersonsComplete;
  }
}
