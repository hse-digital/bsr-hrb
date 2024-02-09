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

  toAnsiDateString(): string {

    this.year = this.toDate().getFullYear().toString();

    if (this.month.length < 2) 
        this.month = '0' + this.month;

    if (this.day.length < 2) 
        this.day = '0' + this.day;

    return `${this.year}-${this.month}-${this.day}`;
  }
}

export function isEmpty(
  day: string | number | undefined,
  month: string | number | undefined, 
  year: string | number | undefined)  {
    return !FieldValidations.IsNotNullOrWhitespace(day?.toString())
      && !FieldValidations.IsNotNullOrWhitespace(month?.toString())
      && !FieldValidations.IsNotNullOrWhitespace(year?.toString());
}

export function isFull(
  day: string | number | undefined,
  month: string | number | undefined, 
  year: string | number | undefined)  {
    return FieldValidations.IsNotNullOrWhitespace(day?.toString())
      && FieldValidations.IsNotNullOrWhitespace(month?.toString())
      && FieldValidations.IsNotNullOrWhitespace(year?.toString());
}

export function isDayValid(day: string | number | undefined) {
  const dayNumber = Number(day);

  if (!FieldValidations.IsNotNullOrWhitespace(day?.toString()) || isNaN(dayNumber))
  {
    return false;
  }

  if (dayNumber > 31 || dayNumber < 1) {
    return false;
  }

  return true;
}

export function isMonthValid(month: string | number | undefined) {
  const monthNumber = Number(month);

  if (!FieldValidations.IsNotNullOrWhitespace(month?.toString()) || isNaN(monthNumber)) {
    return false;
  }

  if (monthNumber > 12 || monthNumber < 1) {
    return false;
  }

  return true;
}

export function isYearValid(year: string | number | undefined) {
  let yearNumber = Number(year);

  if (!FieldValidations.IsNotNullOrWhitespace(year?.toString()) || isNaN(yearNumber)) {
    return false;
  }

  // Allow for 2 digit years. Use isYearValid in combo with isYearLengthValid
  if (year?.toString().length === 2) {
    year = '20' + year;
    yearNumber = Number(year);
  }

  const todayYear =new Date().getFullYear();

  if (yearNumber < (todayYear - 200) || yearNumber > (todayYear + 200)) {
    return false;
  }

  return true;
}

export function isYearLengthValid(year: string | number | undefined) {
  const yearNumber = Number(year);
  if (!FieldValidations.IsNotNullOrWhitespace(year?.toString()) || isNaN(yearNumber)) {
    return false;
  }
  return yearNumber.toString().length === 4;
}

export function isRealDate(
  year: string | number | undefined,
  month: string | number | undefined,
  day: string | number | undefined,
) {

  if (isEmpty(year, month, day)) {
    return false
  }

   const yearNumber  = Number(year);
   const monthNumber = Number(month);
   const dayNumber = Number(day);   

  if (dayNumber > 31 || dayNumber < 1) {
    return false;
  }

  if (monthNumber > 12 || monthNumber < 1) {
    return false;
  }

  if (year?.toString().length !== 4) {
    return false;
  }

  if (isNaN(yearNumber) || isNaN(monthNumber) || isNaN(dayNumber)) {
    return false
  }

  const realDate = new Date(yearNumber, monthNumber - 1, dayNumber);
  const monthChanged = realDate.getMonth() + 1;

  return monthNumber === monthChanged;
}

export function IsDateInPast(dateModel: DateModel) {
  const date = dateModel!.toDate();
  const today = new Date();
  
  return date <= today;
}
