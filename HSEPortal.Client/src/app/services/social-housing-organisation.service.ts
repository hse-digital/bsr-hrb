import { Injectable } from '@angular/core';
import { OrganisationNamesJson } from 'src/assets/json/organisation_names';

@Injectable({ providedIn: 'root' })
export class SocialHousingOrganisationService {

  constructor() {  }

  getNamesBy(filter: string): string[] {
    return OrganisationNamesJson.values.map(x => x.organisation_name).filter(x => x.indexOf(filter) > -1);
  }

}
