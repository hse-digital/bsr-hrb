import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
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

  async getChangeRequest(): Promise<ChangeRequest> {
    return firstValueFrom(this.httpClient.get(`api/GetChangeRequest/${this.applicationService.model.id}`))
  }
}


export class ChangeRequest {
  Name?: string;
  Category?: ChangeCategory;
  Declaration?: boolean;
  ReviewRequired?: boolean;
  StatusReason?: StatusReason;
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
  DeRegistration
}

export enum StatusReason {
  New = 1,
  Submitted = 760_810_001
}
