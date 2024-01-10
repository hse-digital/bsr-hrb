import { Pipe, PipeTransform } from '@angular/core';
import { FieldValidations } from '../helpers/validators/fieldvalidations';

@Pipe({
  name: 'accountabilityDescription'
})
export class AccountabilityDescriptionPipe implements PipeTransform {

  static readonly accountabilityDescription: Record<string, string> = {
    "none": "External walls and roof",
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

@Pipe({
  name: 'prAccountabilityDescription'
})
export class PublicRegisterAccountabilityDescriptionPipe implements PipeTransform {

  static readonly accountabilityDescription: Record<string, string> = {
    "none": "the external walls and roof",
    "external_walls": "the external walls and roof",
    "routes": "the routes that residents can walk through, like corridors, staircases and fire doors",
    "maintenance": "maintaining plant and equipment - this includes lifts, firefighting equipment and any other machinery in the building"
  }

  transform(value: string, ...args: any[]): string {
    let description = PublicRegisterAccountabilityDescriptionPipe.accountabilityDescription[value];
    return FieldValidations.IsNotNullOrWhitespace(description)
      ? description
      : 'facilities that residents share, like laundry rooms or bin rooms';
  }
}