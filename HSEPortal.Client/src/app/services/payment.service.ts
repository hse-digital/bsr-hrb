import { Injectable } from '@angular/core';

@Injectable()
export class PaymentService {

  model: PaymentModel;

  constructor() {
    this.model = {};
  }
}

export class PaymentModel {
  PaymentId?: string;

  NameOnCard?: string;
  CardNumber?: string;
  ExpiryMonth?: string;
  ExpiryYear?: string;
  SecurityCode?: string;
  BillingAddressLineOne?: string;
  BillingAddressLineTwo?: string;
  BillingPostcode?: string;

  Amount?: number;

  EmployeeNumber?: string;
}
