import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'useSameAddressDescription'
})
export class UseSameAddressDescriptionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
