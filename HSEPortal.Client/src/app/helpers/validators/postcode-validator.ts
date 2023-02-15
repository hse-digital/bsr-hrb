import { IInputValidator } from "./input-validator.interface";

export class PostcodeValidator implements IInputValidator {

  isValid(value: string): boolean {
    return true;
  }

}
