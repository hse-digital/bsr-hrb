export class EmailValidator {
  private static _emailRegex: RegExp = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

  private static _isEmailFormatValid(email: string): boolean {
    return this._emailRegex.test(email);
  }
  
  static isValid(value: string): boolean {
    return this._isEmailFormatValid(value);
  }
}
