import { Component } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { PaymentService } from 'src/app/services/payment.service';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentConfirmationComponent } from '../payment-confirmation/payment-confirmation.component';

@Component({
  selector: 'hse-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'pay';

  errors = {
    nameOnCardHasErrors: false,
    cardNumberHasErrors: false,
    expiryMonthHasErrors: false,
    expiryYearHasErrors: false,
    securityCodeHasErrors: false,
    billingAddressLineOneHasErrors: false,
    billingAddressLineTwoHasErrors: false,
    billingPostcodeHasErrors: false,
  }

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, public paymentService: PaymentService) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.errors.nameOnCardHasErrors = !this.paymentService.model.NameOnCard;
    this.errors.cardNumberHasErrors = !this.paymentService.model.CardNumber;
    this.errors.expiryMonthHasErrors = !this.paymentService.model.ExpiryMonth;
    this.errors.expiryYearHasErrors = !this.paymentService.model.ExpiryYear;
    this.errors.securityCodeHasErrors = !this.paymentService.model.SecurityCode;
    this.errors.billingAddressLineOneHasErrors = !this.paymentService.model.BillingAddressLineOne;
    this.errors.billingAddressLineTwoHasErrors = !this.paymentService.model.BillingAddressLineTwo;
    this.errors.billingPostcodeHasErrors = !this.paymentService.model.BillingPostcode;

    this.hasErrors = this.errors.nameOnCardHasErrors ||
      this.errors.cardNumberHasErrors ||
      this.errors.expiryMonthHasErrors ||
      this.errors.expiryYearHasErrors ||
      this.errors.securityCodeHasErrors ||
      this.errors.billingAddressLineOneHasErrors ||
      this.errors.billingAddressLineTwoHasErrors ||
      this.errors.billingPostcodeHasErrors;

    return !this.hasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PaymentConfirmationComponent.route, activatedRoute);
  }

  postcodeFinder() {

  }

  saveAndComeBackLater() {

  }
}
