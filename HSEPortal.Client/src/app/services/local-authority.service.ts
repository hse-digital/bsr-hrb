import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalAuthorityService {

  constructor(private httpClient: HttpClient) { }

  async getNamesBy(company: string): Promise<string[]> {
    let localAuthorities = await firstValueFrom(this.httpClient.get<LocalAuthority>(`api/SearchLocalAuthorityCompany/${company}`)) as LocalAuthority;
    return localAuthorities?.value?.map(x => x.name);
  }

}

export class LocalAuthority {
  public context!: string;
  public value!: LocalAuthorityValue[];
}

export class LocalAuthorityValue {
  public etag?: string;
  public name!: string;
  public accountid?: string;
}
