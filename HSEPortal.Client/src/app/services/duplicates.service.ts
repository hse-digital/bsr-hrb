import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApplicationService, RegisteredStructureModel } from './application.service';
import { AddressModel } from './address.service';
import { FieldValidations } from '../helpers/validators/fieldvalidations';

@Injectable({
  providedIn: 'root'
})
export class DuplicatesService {

  private index?: number;

  constructor(private httpClient: HttpClient, private applicationService: ApplicationService) { }

  async GetRegisteredStructure(index?: number) {
    this.index = index;
    return FieldValidations.IsNotNullOrWhitespace(this.postcode) ? await this.GetRegisteredStructureBy(this.postcode ?? "", this.addressLineOne ?? "") : {};
  }

  get postcode() {    
    return this.applicationService.currentSection.Addresses[this.index ?? 0].Postcode;
  }

  get addressLineOne() {
    return this.applicationService.currentSection.Addresses[this.index ?? 0].Address;
  }

  async GetRegisteredStructureBy(postcode: string, addressLineOne: string): Promise<RegisteredStructureModel | undefined> {
    try {
      return await firstValueFrom(this.httpClient.post<RegisteredStructureModel>("api/GetRegisteredStructure", {
        Postcode: postcode,
        AddressLineOne: addressLineOne
      }));
    } catch {
      return undefined;
    }
  }
}

export { RegisteredStructureModel };
