import { IInputValidator } from "./input-validator.interface";

export class PhoneNumberValidator implements IInputValidator {

  private _expectedPhonePatterns = [
    { prefix: '+44', length: 13 },
    { prefix: '0', length: 11 },
  ]

  isValid(value: string): boolean {
    return this._isPhoneNumberFormatValid(value);
  }

  setPhonePatterns(phonePatterns: { prefix: string, length: number }[]) {
    this._expectedPhonePatterns = phonePatterns;
    return this;
  }

  private _isPhoneNumberFormatValid(phone: string): boolean {
    let phoneNumber = this._cleanPhoneNumber(phone);
    if (!Number(phoneNumber)) return false;

    return this._expectedPhonePatterns.find((pattern) => phoneNumber.startsWith(pattern.prefix) && phoneNumber.length == pattern.length) != undefined;
  }

  private _cleanPhoneNumber(phone: string): string {
    return phone?.replaceAll(' ', '') ?? '';
  }
}
