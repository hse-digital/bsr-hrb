export class FieldValidations {
  static IsNotNullOrWhitespace: (value: string | undefined) => boolean = (value) => (value?.trim().length ?? 0) > 0;
  static IsGreaterThanZero: (value: number | undefined) => boolean = (value) => value !== undefined && value > 0;

}