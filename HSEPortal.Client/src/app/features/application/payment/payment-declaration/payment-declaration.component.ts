import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentResponseModel, PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'hse-payment-declaration',
  templateUrl: './payment-declaration.component.html'
})
export class PaymentDeclarationComponent extends BaseComponent {
  static route: string = 'declaration';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, public paymentService: PaymentService) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  override async saveAndContinue() {
    await this.initialisePayment();
  }

  private async initialisePayment() {
    this.paymentService.model = await this.paymentService.InitialisePayment({ "Reference": this.applicationService.model.id });
    this.navigateTo(this.paymentService.model.LinkSelf ?? '');
  }

  canContinue(): boolean {
    return true;
  }

  navigateTo(link: string) {
    if (link) window.location.href = link;
  }

  saveAndComeBackLater() {

  }
}
