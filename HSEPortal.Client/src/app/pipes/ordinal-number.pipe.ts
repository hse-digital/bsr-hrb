import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'OrdinalNumberPipe'
})
export class OrdinalNumberPipe implements PipeTransform {

  static readonly ordinalNumberMapper: Record<number, string> = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
    6: "Sixth",
    7: "Seventh",
    8: "Eighth",
    9: "Ninth",
    10: "Tenth",
    11: "Eleventh",
    12: "Twelfth",
    13: "Thirteenth",
    14: "Fourteenth",
    15: "Fifteenth",
    16: "Sixteenth",
    17: "Seventeenth",
    18: "Eighteenth",
    19: "Nineteenth",
    20: "Twentieth",
  };

  transform(value: number, ...args: any[]): string {
    return OrdinalNumberPipe.ordinalNumberMapper[value];
  }

}
