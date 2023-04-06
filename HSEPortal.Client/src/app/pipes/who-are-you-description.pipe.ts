import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whoAreYouDescription'
})
export class WhoAreYouDescriptionPipe implements PipeTransform {

  static readonly whoAreYouDescription: Record<string, string> = {
    "named_contact": "I am the named contact",
    "registering_for": "I am registering for the named contact",
    "employee": "I am an employee"
  };

  transform(value: string | undefined, ...args: any[]): string {
    return WhoAreYouDescriptionPipe.whoAreYouDescription[value ?? ""];
  }

}
