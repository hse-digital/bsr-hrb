export class EmailValidator {
  private static _isEmailFormatValid(email: string): boolean {
    return new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm").test(email);
  }
  
  static isValid(value: string): boolean {
    return this._isEmailFormatValid(value);
  }
}
