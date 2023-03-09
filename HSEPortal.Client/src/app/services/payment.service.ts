import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApplicationService, BuildingRegistrationModel, PaymentModel } from './application.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient) {
  }

  async GetPayment(paymetId: string): Promise<PaymentModel> {
    return await firstValueFrom(this.httpClient.get<PaymentModel>(`api/GetPayment/${paymetId}`));
  }

  async InitialisePayment(applicationModel: BuildingRegistrationModel): Promise<PaymentModel> {
    var address = applicationModel.AccountablePersons[0].PapAddress ?? applicationModel.AccountablePersons[0].Address;
    var body = {
      Reference: applicationModel.id,
      Email: applicationModel.ContactEmailAddress,
      CardHolderDetails: {
        Name: `${applicationModel.ContactFirstName} ${applicationModel.ContactLastName}`,
        Address: {
          Line1: address?.Address,
          Line2: address?.AddressLineTwo,
          Postcode: address?.Postcode,
          City: address?.Town
        }
      }
    };

    return await firstValueFrom(this.httpClient.post<PaymentModel>('api/InitialisePayment', body));
  }
}