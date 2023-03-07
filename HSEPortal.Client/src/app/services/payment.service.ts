import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApplicationService, PaymentModel } from './application.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private applicationService: ApplicationService, private httpClient: HttpClient) {
  }

  async GetPayment(paymetId: string): Promise<PaymentModel> {
    return await firstValueFrom(this.httpClient.get<PaymentModel>(`api/GetPayment/${paymetId}`));
  }

  async InitialisePayment(): Promise<PaymentModel> {
    var address = this.applicationService.model.AccountablePersons[0].PapAddress ?? this.applicationService.model.AccountablePersons[0].Address;
    var body = {
      Reference: this.applicationService.model.id,
      Email: this.applicationService.model.ContactEmailAddress,
      CardHolderDetails: {
        Name: `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`,
        Address: {
          Line1: address?.Address,
          Line2: address?.AddressLineTwo,
          Postcode: address?.Postcode,
          City: address?.Town
        }
      }
    };

    var response = await firstValueFrom(this.httpClient.post<PaymentModel>('api/InitialisePayment', body));
    
    this.applicationService.model.Payment = response;
    await this.applicationService.updateApplication();

    return response;
  }
}