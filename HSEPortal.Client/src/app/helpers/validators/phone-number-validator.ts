export class PhoneNumberValidator {

  private static _expectedPhonePatterns = [
    { prefix: '+44', length: 13 },
    { prefix: '0', length: 11 },
  ]

  static isValid(value: string): boolean {
    return this._isPhoneNumberFormatValid(value);
  }

  private static _cleanPhoneNumber(phone: string): string {
    return phone?.replaceAll(' ', '') ?? '';
  }

  private static _isPhoneNumberFormatValid(phone: string): boolean {
    let phoneNumber = PhoneNumberValidator._cleanPhoneNumber(phone);
    if (!Number(phoneNumber)) return false;

    return this._expectedPhonePatterns.find((pattern) => phoneNumber.startsWith(pattern.prefix) && phoneNumber.length == pattern.length) != undefined;
  }
}
