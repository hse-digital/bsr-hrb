import { FieldValidations } from "./fieldvalidations";

export class DateModel {
  year: string  = '';
  month: string = '';
  day: string = '';

  constructor(dateString?: string) {
    if (FieldValidations.IsNotNullOrWhitespace(dateString)) {
      let date = new Date(dateString!);
      this.day = date.getDate().toString();
      this.month = (date.getMonth() + 1).toString();
      this.year = date.getFullYear().toString();
    }
  }

  toDate(): Date {
    return new Date(
      Number(this.year),
      Number(this.month) - 1,
      Number(this.day)
    );
  }

  toDateString(): string {
    return this.toDate().toISOString();
  }
}

export function isDateValid(
  year: string | number | undefined,
  month: string | number | undefined,
  day: string | number | undefined,
) {

  if (IsDateUndefinedOrEmpty(year, month, day)) {
    return false
  }

   var Year  = Number(year);
   var Month = Number(month);
   var Day = Number(day);

  if (Day > 31 || Day < 1) {
    return false;
  }
  if (Month > 12 || Month < 1) {
    return false;
  }
  if (year?.toString().length !== 4) {
    return false;
  }
  if (Year < new Date().getFullYear()) {
    return false;
  }
  if (new Date(Year, Month) < new Date()) {
    return false;
  }

  return true;

}

export function isDayValid(day: string | number | undefined,
  month: string | number | undefined, year: string | number | undefined) {
  var Day = Number(day);
  var Month = Number(month);
  var Year = Number(year);
  var Maxdays = 31
  var date = new Date(Year, Month-1, Day)


  if (!FieldValidations.IsNotNullOrWhitespace(day?.toString()) || isNaN(Day))
  {
    return false;
  }


  if (Day > Maxdays || Day < 1 || date.getDate() !== Day) {
    return false;
  }

  return true;
}

export function isYearLengthValid(year: string | number | undefined) {
  var Year = Number(year);
  if (!FieldValidations.IsNotNullOrWhitespace(year?.toString()) || isNaN(Year)) {
    return false;
  }
  return Year.toString().length === 4;
}

export function isYearValid(year: string | number | undefined, allowPastYears: boolean = false) {
  var Year = Number(year);
  if (!FieldValidations.IsNotNullOrWhitespace(year?.toString()) || isNaN(Year)) {
    return false;
  }

  if (!allowPastYears) {
    if (Year < new Date().getFullYear()) {
      return false;
    }
  }  

  return true;
}

export function isMonthValid(month: string | number | undefined,
) {
  var Month = Number(month);

  if (!FieldValidations.IsNotNullOrWhitespace(month?.toString()) || isNaN(Month)) {
    return false;
  }

  if (Month > 12 || Month < 1) {
    return false;
  }

  return true;
}

export function IsDateUndefinedOrEmpty(
  year: string | number | undefined,
  month: string | number | undefined,
  day: string | number | undefined,){
  if (!FieldValidations.IsNotNullOrWhitespace(day?.toString())
    || !FieldValidations.IsNotNullOrWhitespace(month?.toString())
    || !FieldValidations.IsNotNullOrWhitespace(year?.toString())) {
    return true;
  }
  return false
}

export function IsDateInPast(dateModel: DateModel) {
  const date = dateModel!.toDate();
  const today = new Date();
  
  return date <= today;
}
