import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whoAreYouDescription'
})
export class WhoAreYouDescriptionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
