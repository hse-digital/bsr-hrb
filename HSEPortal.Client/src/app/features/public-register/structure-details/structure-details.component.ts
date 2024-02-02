import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from 'moment';
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  templateUrl: './structure-details.component.html'
})
export class StructureDetailsComponent implements OnInit {
  public static title: string = 'Structure information - Register a high-rise building - GOV.UK';
  public static route: string = 'structure-information';

  result?: any;
  postcode: any;
  pap?: any;

  otherStructures: any[] = [];

  constructor(private router: Router, private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
    let routerState = this.router.getCurrentNavigation()?.extras.state;

    this.postcode = routerState?.["postcode"];
    this.result = routerState?.["result"];
    this.pap = this.getPap();
  }

  async ngOnInit() {
    this.otherStructures = await this.applicationService.getStructuresForApplication(this.result.ApplicationId);
    StructureDetailsComponent.title = `Structure information - ${this.result.Structure.Name ?? this.result.BuildingName} - Register a high-rise building - GOV.UK`;
  }

  getStructureAddress() {
    let address = this.result.Structure.Addresses[0];
    return this.normalizeAddress(address);
  }

  anyResidentialAddresses(): boolean {
    return this.result.Structure.Addresses.find((x: any) => x.Postcode != x.PostcodeEntered) != undefined;
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
    if (address.IsManual) {
      return [address.Address, address.AddressLineTwo, address.Town, address.Postcode].filter(x => x).join(', ');
    }

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
        content = `${content} by ${structure.CompletionCertificateIssuer}.`;
      }

      if (structure.CompletionCertificateDate) {
        content = `${content} on ${moment(Number(structure.CompletionCertificateDate)).format('LL')}.`;
      }

      return `${content} Completion certificates are issued by the building control body who certified the construction of the building.`;
    }

    return undefined;
  }

  private getPap() {
    return this.result.AccountablePersons[0];
  }

  getOtherAps() {
    return this.result.AccountablePersons.filter((_: any, i: number) => i > 0);
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
    return ap.SectionsAccountability?.filter((x: any) => {
      let structureName = this.result.Structure?.Name ?? this.result.BuildingName;
      return x.SectionName == structureName && (x.Accountability?.length ?? 0) > 0;
    });
  }

  removeDuplicates(accountability: any[]) {
    return accountability.filter(x => x != 'facilities');
  }

  async navigateToOtherStructure(item: any) {
    await this.navigationService.navigateRelative(StructureDetailsComponent.route, this.activatedRoute, undefined, { postcode: this.postcode, result: item });
    window.location.reload();
  }
}
