import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leadJobRoleDescription'
})
export class LeadJobRoleDescriptionPipe implements PipeTransform {

  static readonly leadJobRoleDescription: Record<string, string> = {
    "director": "Director",
    "administrative_worker": "Administrative or office worker",
    "building_manager": "Building or facilities manager",
    "building_director": "Building safety director",
    "other": "Other"
  }

  transform(value: string | undefined, ...args: any[]): string {
    return LeadJobRoleDescriptionPipe.leadJobRoleDescription[value ?? ""];
  }

}
