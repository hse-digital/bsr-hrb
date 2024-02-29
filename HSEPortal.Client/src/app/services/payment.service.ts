import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BuildingRegistrationModel, PaymentInvoiceDetails, PaymentModel } from './application.service';

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

  async InitialiseApplicationCertificatePayment(applicationModel: BuildingRegistrationModel): Promise<PaymentModel> {
    return await firstValueFrom(this.httpClient.post<PaymentModel>(`api/InitialiseApplicationCertificatePayment/${applicationModel.id}`, null));
  }

  async createInvoicePayment(id: string, paymentDetails: PaymentInvoiceDetails): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/InitialiseInvoicePayment/${id}`, paymentDetails));
  }

  async createInitialiseCertificateInvoicePayment(id: string, paymentDetails: PaymentInvoiceDetails): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/InitialiseCertificateInvoicePayment/${id}`, paymentDetails));
  }
}