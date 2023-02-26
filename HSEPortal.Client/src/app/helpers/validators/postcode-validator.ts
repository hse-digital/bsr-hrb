import { HttpClient } from "@angular/common/http";
import { IInputValidator } from "./input-validator.interface";

export class PostcodeValidator implements IInputValidator {

  constructor(private httpClient: HttpClient) {
  }

  async isValid(postcode: string): Promise<boolean> {
    return true;
  }

}
