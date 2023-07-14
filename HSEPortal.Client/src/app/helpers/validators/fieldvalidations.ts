import { KeyValue } from "src/app/services/application.service";

export class FieldValidations {
  static IsNotNullOrWhitespace: (value: string | undefined) => boolean = (value) => (value?.trim().length ?? 0) > 0;
  static IsGreaterThanZero: (value: number | undefined) => boolean = (value) => value !== undefined && value > 0;
  static IsLessThanOrEqualTo100: (value: number | undefined) => boolean = (value) => value !== undefined && value <= 100;
  static IsAPositiveNumber: (value: number | undefined) => boolean = (value) => value !== undefined && value > -1;
  static IsWholeNumber: (value: number | undefined) => boolean = (value) => value !== undefined && (value % 1 === 0);
  static IsNotNullOrEmpty: (value: any[] | undefined) => boolean = (value) => value !==undefined && value.length > 0;
  
  static IsNotNullAndValuesAreNotEmpty: (value: KeyValue<string, string[]>[] | undefined) => boolean = (keyValue) => keyValue !==undefined && keyValue.every(x => x.key !== undefined && x.key.length > 0) && keyValue.every(x => x.value !==undefined && x.value.length > 0);
  static IsNotNullAndValueIsNotNullOrWhitespace: (value: KeyValue<string, string>[] | undefined) => boolean = (keyValue) => keyValue !==undefined && keyValue.every(x => x.key !== undefined && x.key.length > 0) && keyValue.every(x => x.value !==undefined && x.value.length > 0);
  static IsNotNullAndValueIsAPositiveNumber: (value: KeyValue<string, number>[] | undefined) => boolean = (keyValue) => keyValue !==undefined && keyValue.every(x => x.key !== undefined && x.key.length > 0) && keyValue.every(x => x.value !==undefined && x.value > -1);
}
