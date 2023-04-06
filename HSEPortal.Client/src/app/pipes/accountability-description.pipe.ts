import { Pipe, PipeTransform } from '@angular/core';
import { FieldValidations } from '../helpers/validators/fieldvalidations';

@Pipe({
  name: 'accountabilityDescription'
})
export class AccountabilityDescriptionPipe implements PipeTransform {

  static readonly accountabilityDescription: Record<string, string> = {
    "external_walls": "External walls and roof",
    "routes": "Routes that residents can walk through",
    "maintenance": "Maintaining plant and equipment"
  }

  transform(value: string, ...args: any[]): string {
    let description = AccountabilityDescriptionPipe.accountabilityDescription[value];
    return FieldValidations.IsNotNullOrWhitespace(description)
      ? description
      : 'Facilities that residents share';
  }

}
