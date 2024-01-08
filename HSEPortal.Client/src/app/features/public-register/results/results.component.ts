import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { PageComponent } from "src/app/helpers/page.component";
import { ApplicationService } from "src/app/services/application.service";
import { StructureDetailsComponent } from "../structure-details/structure-details.component";

@Component({
  templateUrl: './results.component.html'
})
export class PublicRegisterResultsComponent extends PageComponent<any> {
  public static title: string = 'Select structure - Register a high-rise building - GOV.UK';
  public static route: string = 'results';

  results?: any[] = [];
  postcode?: string;

  constructor(router: Router, activatedRoute?: ActivatedRoute) {
    super(activatedRoute);

    let routerState = this.router.getCurrentNavigation()?.extras.state;

    this.postcode = routerState?.["postcode"];

    let results = routerState?.["public-register-results"];
    for (let result of results) {
      for (let section of result.Sections) {
        this.results?.push({
          result: result,
          section: section
        });
      }
    }

  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.updateOnSave = false;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    this.hasErrors = !this.model;
    return !this.hasErrors;
  }

  override  navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(StructureDetailsComponent.route, this.activatedRoute, undefined, { postcode: this.model, result: this.model.result });
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

  postcodeMatches(item: any) {
    let addressPostcode = item.section.Addresses[0]?.Postcode?.replace(' ', '');
    return addressPostcode == this.postcode?.replace(' ', '');
  }
}