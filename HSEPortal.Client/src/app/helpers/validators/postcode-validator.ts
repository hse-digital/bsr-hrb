import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { PostcodeAPI } from "src/app/helpers/API/postcode.api";
import { IInputValidator } from "./input-validator.interface";

export class PostcodeValidator implements IInputValidator {
    private _postcodeAPI: PostcodeAPI;

  constructor(private httpClient: HttpClient) {
    this._postcodeAPI = new PostcodeAPI(httpClient);
  }

  async isValid(postcode: string): Promise<boolean> {
    let address: string[] = await this._postcodeAPI.getAddressUsingPostcodeOnDPA(postcode);
    return address.length > 0;
  }

}
