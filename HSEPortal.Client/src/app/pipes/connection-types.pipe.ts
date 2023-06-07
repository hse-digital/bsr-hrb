import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ConnectionTypesPipe'
})
export class ConnectionTypesPipe implements PipeTransform {

  static readonly connectionTypes: Record<string, string> = {
    "bridge-walkway": "Bridge or walkway between sections",
    "car-park": "Car park below ground",
    "ground-floor": "Ground floor", 
    "levels-below-ground-residential-unit": "Levels below ground with a residential unit", 
    "levels-below-ground-no-residential-unit": "Levels below ground without a residential unit", 
    "shared-wall-emergency-door": "Shared wall with emergency door", 
    "shared-wall-everyday-door": "Shared wall with everyday use door", 
    "shared-wall-no-door": "Shared wall with no door", 
    "other": "Other" 
  }

  transform(value: string): string {
    return ConnectionTypesPipe.connectionTypes[value];
  }

}


