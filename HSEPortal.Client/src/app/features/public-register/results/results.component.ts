import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  templateUrl: './results.component.html'
})
export class PublicRegisterResultsComponent {
  public static title: string = 'Select structure - Register a high-rise building - GOV.UK';
  public static route: string = 'results';

  results?: any[];
  postcode?: string;

  constructor(private router: Router) {
    let routerState = this.router.getCurrentNavigation()?.extras.state;

    this.postcode = routerState?.["postcode"];
    this.results = routerState?.["public-register-results"];
  }

  async continue() {

  }

  getRadioLabel(section: any, resultItem: any) {
    let buildingName = resultItem.BuildingName;
    if (section.Name) {
      return `${section.Name} (part of ${buildingName})`;
    }

    return buildingName;
  }

  getStructureAddress(section: any) {
    let address = section.Addresses[0];
    let splitAddress = address.Address.split(',');
    if (splitAddress.length == 1) {
      return splitAddress[0];
    }

    let addressNumber = splitAddress[1].replace(',', '').trim();
    if (!this.isNumber(addressNumber)) {
      return `${this.toCamelCase(splitAddress[1])}, ${this.toCamelCase(address.Town)}, ${address.Postcode}`;
    }

    return `${splitAddress[1]} ${this.toCamelCase(splitAddress[2])}, ${this.toCamelCase(address.Town)}, ${address.Postcode}`;
  }

  private toCamelCase(str: string) {
    let ans = str.toLowerCase();
    let parts = ans.split(" ");

    if (parts.length == 1) {
      let part = parts[0];
      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    }

    return parts.reduce((s, c) => `${s} ${c.charAt(0).toUpperCase()}${c.slice(1)}`);
  }

  private isNumber(value?: string | number): boolean {
    return ((value != null) &&
      (value !== '') &&
      !isNaN(Number(value.toString())));
  }
}