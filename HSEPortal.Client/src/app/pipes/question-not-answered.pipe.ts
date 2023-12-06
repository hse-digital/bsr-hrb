import { Pipe, PipeTransform } from '@angular/core';
import { FieldValidations } from '../helpers/validators/fieldvalidations';

@Pipe({
  name: 'QuestionNotAnswered'
})
export class QuestionNotAnsweredPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    let valueExists = typeof value == "string" ? FieldValidations.IsNotNullOrWhitespace(value) : value != undefined;
    return valueExists ? value : "Not provided";
  }

}
