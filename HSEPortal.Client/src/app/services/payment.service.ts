import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {

  model: PaymentModel;

  constructor(private httpClient: HttpClient) {
    this.model = {};
  }

  async GetPayment(paymetId: string): Promise<PaymentResponseModel> {
    return await firstValueFrom(this.httpClient.get<PaymentResponseModel>(`api/GetPayment/${paymetId}`));
  }

  async InitialisePayment(body: any): Promise<PaymentResponseModel> {
    return await firstValueFrom(this.httpClient.post<PaymentResponseModel>('api/InitialisePayment', body));
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
  ReturnURL?: string;
  Reference?: string;
  Description?: string;

  EmployeeNumber?: string;
}

export class PaymentResponseModel {
  public CreatedDate?: string;
  public Status?: string;
  public Finished?: boolean;
  public LinkSelf?: string;
  public Amount?: number;
  public Reference?: string;
  public Description?: string;
  public ReturnURL?: string;
  public PaymentId?: string;
  public PaymentProvider?: string;
  public ProviderId?: string;
}
