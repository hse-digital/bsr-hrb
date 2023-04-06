import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BuildingRegistrationModel, PaymentModel } from './application.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient) {
  }

  async GetPayment(paymentReference: string): Promise<PaymentModel> {
    return await firstValueFrom(this.httpClient.get<PaymentModel>(`api/GetPayment/${paymentReference}`));
  }

  async InitialisePayment(applicationModel: BuildingRegistrationModel): Promise<PaymentModel> {
    return await firstValueFrom(this.httpClient.post<PaymentModel>(`api/InitialisePayment/${applicationModel.id}`, null));
  }
}