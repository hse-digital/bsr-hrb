import { HttpClient } from "@angular/common/http";
import { firstValueFrom, map, Observable } from "rxjs";

export class PostcodeAPI {

  private API_KEY: string = 'fPaSsYzfdvNhUwwV8r36LexwkqMsk15A';
  private _dataset: string = 'DPA';

  constructor(private httpClient: HttpClient) {
  }

  getDataUsingPostcode(postcode: string): Promise<any> {
    let url = `https://api.os.uk/search/places/v1/postcode?postcode=${postcode}&dataset=${this._dataset}&key=${this.API_KEY}`

    return this.httpClient.get(url).pipe(map(x => x)).toPromise().catch((error) => {
      console.log(error.error.error.statuscode);
    });;

  }

  getDataUsingAddressOnLPI(address: string): Promise<any> {
    let url = `https://api.os.uk/search/places/v1/find?query=\"${address}\"&dataset=LPI&key=${this.API_KEY}`
    return this.httpClient.get(url).pipe(map(x => x)).toPromise().catch((error) => {
      console.log(error.error.error.statuscode);
    });
  }

  async getAddressUsingPostcodeOnDPA(postcode: string): Promise<any[]> {
    let address: string[] = [];
    this._dataset = 'DPA';
    let data: any = await this.getDataUsingPostcode(postcode)
    
    data?.results?.map((x: any) => address.push(x.DPA.ADDRESS));
    return address;
  }

  async getAddressUsingPostcodeOnLPI(postcode: string): Promise<any[]> {
    let address: string[] = [];
    this._dataset = 'LPI';
    let data: any = await this.getDataUsingPostcode(postcode)
    
    data?.results?.map((x: any) => address.push(x.LPI.ADDRESS));
    return address;
  }

  async getBuildingNamesUsingPostcodeOnDPA(postcode: string): Promise<any[]> {
    this._dataset = 'DPA';
    let buildingNames: string[] = [];
    let data: any = await this.getDataUsingPostcode(postcode);
    
    data?.results?.map((x: any) => buildingNames.push(x.DPA.BUILDING_NAME));
    return buildingNames;
  }

  async getOrganisationsUsingPostcodeOnLPI(postcode: string): Promise<any[]> {
    this._dataset = 'LPI';
    let organisation: string[] = [];
    let data: any = await this.getDataUsingPostcode(postcode);
    
    data?.results?.forEach((x: any) => {
      let orgName = x.LPI['ORGANISATION'];
      if (orgName) organisation.push(orgName);
    });
    return organisation;
  }

  async getAddressUsingAddressOnLPI(address: string): Promise<any[]> {
    let result: any[] = [];
    let data: any = await this.getDataUsingAddressOnLPI(address);
    
    data?.results?.map((x: any) => result.push(x.LPI.ADDRESS));
    return result;
  }

}
