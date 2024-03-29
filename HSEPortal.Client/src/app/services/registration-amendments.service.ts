import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationService, Status } from './application.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RegistrationAmendmentsService {
 
  constructor(private httpClient: HttpClient, private applicationService: ApplicationService) {
  }

  async syncNewPrimaryUser() {
    await firstValueFrom(this.httpClient.post(`api/UpdatePrimaryApplicant/${this.applicationService.model.id}`, this.applicationService.model));
  }

  async syncSecondaryUser() {
    await firstValueFrom(this.httpClient.post(`api/CreateSecondaryApplicant/${this.applicationService.model.id}`, this.applicationService.model));
  }

  async deleteSecondaryUserLookup() {
    await firstValueFrom(this.httpClient.post(`api/DeleteSecondaryUserLookup/${this.applicationService.model.id}`, this.applicationService.model));
  }

  async syncChangeRequest() {
    await firstValueFrom(this.httpClient.post(`api/CreateChangeRequest/${this.applicationService.model.id}`, this.applicationService.model));
  }

  async getChangeRequest(): Promise<ChangeRequest[]> {
    return firstValueFrom(this.httpClient.get(`api/GetChangeRequest/${this.applicationService.model.id}`)) as Promise<ChangeRequest[]>;
  }
  
  async syncRemovedStructures() {
    await firstValueFrom(this.httpClient.post(`api/UpdateRemovedStructures/${this.applicationService.model.id}/${this.applicationService.currentVersion.Name}`, this.applicationService.model));
  }

  async syncDeregister() {
    await firstValueFrom(this.httpClient.post(`api/WithdrawApplicationOrBuilding/${this.applicationService.model.id}`, this.applicationService.model));
  }

  async deactivateSingleStructure(buildingName: string, postcode: string) {
    await firstValueFrom(this.httpClient.post(`api/DeactivateSingleStructure/${this.applicationService.model.id}/${buildingName}/${postcode}`, this.applicationService.model));
  }
}


export class ChangeRequest {
  Status?: Status;
  Name?: string;
  Category?: ChangeCategory;
  Declaration?: boolean;
  ReviewRequired?: boolean;
  StructureName?: string;
  StructurePostcode?: string;
  Change?: Change[];
}

export class Change {
  Name?: string;
  Table?: string;
  FieldName?: string;
  OriginalAnswer?: string;
  NewAnswer?: string;
}

export enum ChangeCategory {
  ApplicationBuildingAmendments,
  ChangeApplicantUser,
  DeRegistration,
  ChangePAPOrLeadContact
}

export enum CancellationReason {
  FloorsHeight,
  ResidentialUnits,
  EveryoneMovedOut,
  IncorrectlyRegistered,
  NoConnected,
  NoCancellationReason
}
