export class FieldValidations {
  static IsNotNullOrWhitespace: (value: string | undefined) => boolean = (value) => (value?.trim().length ?? 0) > 0;
  static IsGreaterThanZero: (value: number | undefined) => boolean = (value) => value !== undefined && value > 0;
  static IsLessThanOrEqualTo100: (value: number | undefined) => boolean = (value) => value !== undefined && value <= 100;
  static IsAPositiveNumber: (value: number | undefined) => boolean = (value) => value !== undefined && value > -1;
  static IsWholeNumber: (value: number | undefined) => boolean = (value) => value !== undefined && (value % 1 === 0);
  static IsNotNullOrEmpty: (value: any[] | undefined) => boolean = (value) => value !==undefined && value.length > 0;
  
  static IsNotNullAndValuesAreNotEmpty: (value: Record<string, string[]> | undefined) => boolean = (value) => value !==undefined && Object.keys(value).length > 0 && Object.keys(value).every(x => !!value[x] && value[x].length > 0);
  static IsNotNullAndValueIsNotNullOrWhitespace: (value: Record<string, string> | undefined) => boolean = (value) => value !==undefined && Object.keys(value).length > 0 && Object.keys(value).every(x => !!value[x] && value[x].length > 0);
  static IsNotNullAndValueIsAPositiveNumber: (value: Record<string, number> | undefined) => boolean = (value) => value !==undefined && Object.keys(value).length > 0 && Object.keys(value).every(x => !!value[x] && value[x] > -1);
}
