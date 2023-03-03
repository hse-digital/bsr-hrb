import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {

  model: PaymentResponseModel;

  constructor(private httpClient: HttpClient) {
    this.model = new PaymentResponseModel();
  }

  async GetPayment(paymetId: string): Promise<PaymentResponseModel> {
    return await firstValueFrom(this.httpClient.get<PaymentResponseModel>(`api/GetPayment/${paymetId}`));
  }

  async InitialisePayment(body: any): Promise<PaymentResponseModel> {
    return await firstValueFrom(this.httpClient.post<PaymentResponseModel>('api/InitialisePayment', body));
  }
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
