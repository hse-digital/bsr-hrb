import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'hse-payment-declaration',
  templateUrl: './payment-declaration.component.html'
})
export class PaymentDeclarationComponent extends BaseComponent implements OnInit {
  static route: string = 'declaration';

  loading = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, public paymentService: PaymentService) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  async ngOnInit() {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.PaymentInProgress;
    await this.applicationService.updateApplication();
  }

  override async saveAndContinue() {
    this.loading = true;

    var paymentResponse = await this.paymentService.InitialisePayment();
    if (typeof window !== 'undefined') {
      window.location.href = paymentResponse.PaymentLink;
    }
  }

  canContinue(): boolean {
    return true;
  }

  saveAndComeBackLater() {

  }
}
