import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueToExternalWallMaterials'
})
export class ExternalWallMaterialsPipe implements PipeTransform {

  static readonly externalWallMaterials: Record<string, string> = {
    "acm": "Aluminium composite materials (ACM)",
    "hpl": "High pressure laminate (HPL)",
    "metal-composite-panels": "Metal composite panels",
    "other-composite-panels": "Other composite panels",
    "concrete": "Concrete",
    "green-walls": "Green walls",
    "masonry": "Masonry",
    "metal-panels": "Metal panels",
    "render": "Render",
    "tiles": "Tiles",
    "timber": "Timber",
    "other": "Other",
    "glass": "Glass",
    "": ""   
  };

  transform(value: string | undefined, ...args: any[]): string {
    return ExternalWallMaterialsPipe.externalWallMaterials[value ?? ""] ?? "";
  }

}













