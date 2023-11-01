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
    let currentSectionAddress = this.applicationService.currentSectionAddress;
    let newSectionAddress = this.applicationService.currentChangedSection.SectionModel?.Addresses[this.index ?? this.applicationService._currentSectionAddressIndex];
    
    return !!newSectionAddress && FieldValidations.IsNotNullOrWhitespace(newSectionAddress.Postcode) 
      ? newSectionAddress?.Postcode 
      : currentSectionAddress?.Postcode;
  }

  get addressLineOne() {
    let currentSectionAddress = this.applicationService.currentSectionAddress;
    let newSectionAddress = this.applicationService.currentChangedSection.SectionModel?.Addresses[this.index ?? this.applicationService._currentSectionAddressIndex];

    return !!newSectionAddress && FieldValidations.IsNotNullOrWhitespace(newSectionAddress.Address) 
      ? newSectionAddress?.Address 
      : currentSectionAddress?.Address;
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
