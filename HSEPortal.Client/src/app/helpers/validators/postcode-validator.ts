import { IInputValidator } from "./input-validator.interface";

export class PhoneNumberValidator implements IInputValidator {

  isValid(value: string): boolean {
    return true;
  }

}
