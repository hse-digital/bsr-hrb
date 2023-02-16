import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { IInputValidator } from "./input-validator.interface";

export class PostcodeValidator implements IInputValidator {

  private API_KEY: string = 'fPaSsYzfdvNhUwwV8r36LexwkqMsk15A';

  constructor(private httpClient: HttpClient) {

  }

  isValid(value: string): boolean {
    let result = this.getData(value);
    return true;
  }

  async getData(postcode: string) {
    let url = `https://api.os.uk/search/places/v1/postcode?postcode=${postcode}&key=${this.API_KEY}`
    return await firstValueFrom(this.httpClient.get(url)).then((value) => { return value });
  }

}
