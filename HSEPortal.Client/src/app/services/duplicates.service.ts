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

  constructor(private httpClient: HttpClient, private applicationService: ApplicationService) { }

  async GetRegisteredStructure() {
    let postcode = this.applicationService.currentSectionAddress?.Postcode ?? "";
    let addressLineOne = this.applicationService.currentSectionAddress?.Address ?? "";
    return FieldValidations.IsNotNullOrWhitespace(postcode) ? await this.GetRegisteredStructureBy(postcode!, addressLineOne!) : {};
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
