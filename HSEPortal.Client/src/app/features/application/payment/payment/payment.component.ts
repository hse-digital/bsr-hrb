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
})
export class PaymentComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'pay';
  private paymentReturnUrl: string = '';
  private reference: string = '';

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

  override async saveAndContinue() {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      try {
        await this.paymentService.InitialisePayment({
          "Amount": this.paymentService.model?.Amount ?? -1,
          "Reference": this.reference,
          "ReturnLink": this.paymentReturnUrl,
          "Description": "",
          "Email": "",
          "CardholderName": this.paymentService.model.NameOnCard,
          "AddressLineOne": this.paymentService.model.BillingAddressLineOne,
          "AddressLineTwo": this.paymentService.model.BillingAddressLineTwo,
          "Postcode": this.paymentService.model.BillingPostcode,
          "City": "",
          "Country": "",
        })
        await this.navigateToNextPage(this.navigationService, this.activatedRoute);
      } catch {

      }
    }
  }

  canContinue() {
    return !this.paymentHasErrors();
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PaymentConfirmationComponent.route, activatedRoute);
  }

  postcodeFinder() {

  }

  saveAndComeBackLater() {

  }

  private paymentHasErrors() {
    this.errors.nameOnCardHasErrors = !this.paymentService.model.NameOnCard;
    this.errors.cardNumberHasErrors = !this.paymentService.model.CardNumber;
    this.errors.expiryMonthHasErrors = !this.paymentService.model.ExpiryMonth;
    this.errors.expiryYearHasErrors = !this.paymentService.model.ExpiryYear;
    this.errors.securityCodeHasErrors = !this.paymentService.model.SecurityCode;
    this.errors.billingAddressLineOneHasErrors = !this.paymentService.model.BillingAddressLineOne;
    this.errors.billingAddressLineTwoHasErrors = !this.paymentService.model.BillingAddressLineTwo;
    this.errors.billingPostcodeHasErrors = !this.paymentService.model.BillingPostcode;

    let errors = this.errors.nameOnCardHasErrors ||
      this.errors.cardNumberHasErrors ||
      this.errors.expiryMonthHasErrors ||
      this.errors.expiryYearHasErrors ||
      this.errors.securityCodeHasErrors ||
      this.errors.billingAddressLineOneHasErrors ||
      this.errors.billingAddressLineTwoHasErrors ||
      this.errors.billingPostcodeHasErrors;

    return errors;
  }
}
