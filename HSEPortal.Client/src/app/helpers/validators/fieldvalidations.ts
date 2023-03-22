export class FieldValidations {
  static IsNotNullOrWhitespace: (value: string | undefined) => boolean = (value) => (value?.trim().length ?? 0) > 0;
  
}