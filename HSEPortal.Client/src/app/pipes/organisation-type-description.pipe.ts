import { Pipe, PipeTransform } from '@angular/core';
import { FieldValidations } from '../helpers/validators/fieldvalidations';

@Pipe({
  name: 'organisationTypeDescription'
})
export class OrganisationTypeDescriptionPipe implements PipeTransform {

  static readonly organisationTypeDescription: Record<string, string> = {
    "commonhold-association": "Commonhold association",
    "housing-association": "Registered provider of social housing",
    "local-authority": "Local authority",
    "management-company": "Private registered provider of social housing",
    "rmc-or-organisation": "Resident management company (RMC) or organisation",
    "rtm-or-organisation": "Right to manage (RTM) company or organisation"
  }

  transform(value: string | undefined, organisationTypeDescription: string | undefined): string {
    let organisationType = OrganisationTypeDescriptionPipe.organisationTypeDescription[value ?? ""];

    return FieldValidations.IsNotNullOrWhitespace(organisationType)
      ? organisationType
      : organisationTypeDescription ?? "";
  }

}
