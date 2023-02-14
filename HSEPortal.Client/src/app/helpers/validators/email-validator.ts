import { IInputValidator } from "./input-validator.interface";

export class EmailValidator implements IInputValidator {

  private _emailRegex: RegExp = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

  isValid(value: string): boolean {
    return this._isEmailFormatValid(value);
  }

  setEmailRegex(regex: RegExp) {
    this._emailRegex = regex;
    return this;
  }

  private _isEmailFormatValid(email: string): boolean {
    return this._emailRegex.test(email);
  }
}
