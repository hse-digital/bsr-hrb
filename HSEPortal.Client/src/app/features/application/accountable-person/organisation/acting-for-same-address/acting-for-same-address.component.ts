import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { ActingForAddressComponent } from "../acting-for-address/acting-for-address.component";
import { LeadNameComponent } from "../lead-name/lead-name.component";
import { ApHelper } from "src/app/helpers/ap-helper";
import { PageComponent } from "src/app/helpers/page.component";
import { OutgoingAccountabilityPageComponent } from "../../outgoing-accountability/outgoing-accountability.component";

@Component({
  templateUrl: './acting-for-same-address.component.html'
})
export class ActingForSameAddressComponent extends PageComponent<string> {
  static route: string = 'same-address';
  static title: string = "Do you have same address as PAP organisation? - Register a high-rise building - GOV.UK";



  sameAddressHasErrors = false;
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentAccountablePerson.ActingForSameAddress;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.ActingForSameAddress = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return applicationService.isChangeAmendmentInProgress || (ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService)
      && this.applicationService.currentAccountablePerson.Role == "registering_for");
  }

  override isValid(): boolean {
    this.sameAddressHasErrors = !this.model;
    return !this.sameAddressHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentAccountablePerson.ActingForSameAddress == 'no') {
      return this.navigationService.navigateRelative(ActingForAddressComponent.route, this.activatedRoute);
    }

    if (this.applicationService.isChangeAmendmentInProgress) {
      return this.navigationService.navigateRelative(`../${OutgoingAccountabilityPageComponent.route}`, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(LeadNameComponent.route, this.activatedRoute);
  }

  getErrorMessage() {
    return `Select Yes, use this address if we should use ${this.getOrganisationAddress()} to contact you`;
  }

  getOrganisationAddress() {
    var address = this.applicationService.currentAccountablePerson.PapAddress ?? this.applicationService.currentAccountablePerson.Address;
    var addressLine = this.getAddressLineOne(address);

    if (address?.AddressLineTwo) {
      addressLine = `${addressLine}, ${address.AddressLineTwo}`;
    }

    return `${addressLine}, ${address?.Postcode}`;
  }

  getAddressLineOne(address?: AddressModel) {
    if (!address) return undefined;

    if (address?.IsManual)
      return address.Address;

    var address2 = address.Address?.replace(address.Town!, '')!;
    address2 = address2.replace(address?.Postcode!, '');

    return address2.split(',').filter(x => x.trim().length > 0).join(', ');
  }

  getAddressTitle() {
      var ap = this.applicationService.currentAccountablePerson;
    return this.applicationService.isChangeAmendmentInProgress ? `${ap.LeadFirstName} ${ap.LeadLastName}'s address` : "Your address";
  }

  getAddressDescription() {
    if (this.applicationService.isChangeAmendmentInProgress) {
      var ap = this.applicationService.currentAccountablePerson;
      return `Should we use the same address to contact ${ap.LeadFirstName} ${ap.LeadLastName}?`
    }

    return "Should we use the same address to contact you?";
  }

}
