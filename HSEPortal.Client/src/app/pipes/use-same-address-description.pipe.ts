import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'useSameAddressDescription'
})
export class UseSameAddressDescriptionPipe implements PipeTransform {

  static readonly useSameAddressDescription: Record<string, string> = {
    "yes": "Yes, use the same address",
    "no": "No, use a different address"
  }

  transform(value: string | undefined, ...args: any[]): string {
    return UseSameAddressDescriptionPipe.useSameAddressDescription[value ?? ""]
  }

}
