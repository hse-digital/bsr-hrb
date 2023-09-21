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
}
