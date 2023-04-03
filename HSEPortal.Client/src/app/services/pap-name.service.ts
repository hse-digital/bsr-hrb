import { Injectable } from '@angular/core';
import { AccountablePersonModel, ApplicationService } from './application.service';

@Injectable()
export class PapNameService {

  constructor(private applicationService: ApplicationService) { }

  getPapName(pap: AccountablePersonModel): string | undefined {
    if (pap.Type == 'organisation' && !!pap.OrganisationName) {
      return pap.OrganisationName;
    } else {
      if (pap.IsPrincipal == 'yes' && !!this.applicationService.model.ContactFirstName && !!this.applicationService.model.ContactLastName) {
        return `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
      } else if (!!pap.FirstName && !!pap.LastName) {
        return `${pap.FirstName} ${pap.LastName}`;
      }
    }
    return undefined;
  }
}
