import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'WhyWantRemoveSection'
})
export class WhyWantRemoveSectionPipe implements PipeTransform {

  static readonly WhyWantRemoveSection: Record<string, string> = {
    "floors_height": "It now has less than 7 floors and is less than 18 metres in height",
    "residential_units": "It now has less than 2 residential units",
    "everyone_moved_out": "Everyone has moved out",
    "incorrectly_registered": "It was incorrectly registered as part of this building",
    "no_connected": "It is no longer connected to the other structures",
  };

  transform(value: string | undefined, ...args: any[]): string {
    return WhyWantRemoveSectionPipe.WhyWantRemoveSection[value ?? ""];
  }

}