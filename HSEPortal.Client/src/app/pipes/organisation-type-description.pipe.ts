import { Pipe, PipeTransform } from '@angular/core';
import { FieldValidations } from '../helpers/validators/fieldvalidations';

@Pipe({
  name: 'organisationTypeDescription'
})
export class OrganisationTypeDescriptionPipe implements PipeTransform {

  static readonly organisationTypeDescription: Record<string, string> = {
    "commonhold-association": "Commonhold association",
    "housing-association": "Housing association or other company operating under section 27 of the Housing Act 1985",
    "local-authority": "Local authority",
    "management-company": "Management company",
    "rmc-or-organisation": "Resident management company (RMC) or organisation",
    "rtm-or-organisation": "Right to manage (RTM) company or organisation"
  }

  transform(value: string, ...args: unknown[]): string {
    let organisationType = OrganisationTypeDescriptionPipe.organisationTypeDescription[value ?? ""];

    return FieldValidations.IsNotNullOrWhitespace(organisationType)
      ? organisationType
      : this.ap.OrganisationTypeDescription;
  }

}
