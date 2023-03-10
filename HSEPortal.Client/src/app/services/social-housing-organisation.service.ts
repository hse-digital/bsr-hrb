import { Injectable } from '@angular/core';
import { SocialHousingOrganisationNamesJson } from 'src/assets/json/social-housing-organisation-names';

@Injectable({ providedIn: 'root' })
export class SocialHousingOrganisationService {

  constructor() { }
 
  getNamesBy(filter: string): string[] {
    return SocialHousingOrganisationNamesJson.values
              .map(x => x.organisation_name)
              .filter(x => x.toLowerCase().indexOf(filter.toLowerCase()) > -1);
  }

}
