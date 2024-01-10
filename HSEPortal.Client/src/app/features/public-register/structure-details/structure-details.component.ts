import { Component } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from 'moment';

@Component({
  templateUrl: './structure-details.component.html'
})
export class StructureDetailsComponent {
  public static title: string = 'Structure information - Register a high-rise building - GOV.UK';
  public static route: string = 'structure-information';

  result?: any;
  postcode: any;

  constructor(private router: Router) {
    let routerState = this.router.getCurrentNavigation()?.extras.state;

    this.postcode = routerState?.["postcode"];
    this.result = routerState?.["result"];

    console.log(this.result);
  }

  getStructureAddress() {
    let address = this.result.Structure.Addresses[0];
    return this.normalizeAddress(address);
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

  getSecondaryAddresses() {
    let normalizedModel = this.postcode?.replace(' ', '');
    return this.result.Structure.Addresses.filter((address: any) => address.Postcode?.replace(' ', '') != normalizedModel || address.PostcodeEntered.replace(' ', '') != normalizedModel)
  }

  normalizeAddress(address: any) {
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

  getYearOfCompletion() {
    if (this.result.Structure.YearOfCompletionOption == 'year-exact') {
      return `in ${this.result.Structure.YearOfCompletion}`;
    }

    return `between ${this.result.Structure.YearOfCompletionRange?.replace('-to', '')}`;
  }

  getCompletionCertificateDetails() {
    let structure = this.result.Structure;

    if (structure.CompletionCertificateReference) {
      let content = `A completion certifcate was issued`;

      if (structure.CompletionCertificateIssuer) {
        content = `${content} by ${structure.CompletionCertificateIssuer}`;
      }

      if (structure.CompletionCertificateDate) {
        content = `${content} on ${moment(Number(structure.CompletionCertificateDate)).format('LL')}.`;
      }

      return `${content} Completion certificates are issued by the building control body who certified the construction of the building.`;
    }

    return undefined;
  }

  getPap() {
    return this.result.AccountablePersons.find((person: any) => person.IsPrincipal == 'yes');
  }

  getOtherAps() {
    return this.result.AccountablePersons.filter((person: any) => person.IsPrincipal != 'yes');
  }
  
  getApName(ap: any) {
    if (ap.IsPrincipal == 'yes') {
      return `${this.result.ContactFirstName} ${this.result.ContactLastName}`;
    }

    if (ap.Type == 'individual') {
      return 'An individual';
    }

    return ap.OrganisationName;
  }

  sectionsWithAccountability(ap: any) {
    return ap.SectionsAccountability?.filter((x: any) => x.SectionName == this.result.Structure.Name && (x.Accountability?.length ?? 0) > 0);
  }
}