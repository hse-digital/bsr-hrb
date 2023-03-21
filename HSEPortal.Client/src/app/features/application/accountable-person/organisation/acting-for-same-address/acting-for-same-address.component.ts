import { Component, QueryList, ViewChildren } from "@angular/core";
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, Router } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { ActingForAddressComponent } from "../acting-for-address/acting-for-address.component";
import { LeadNameComponent } from "../lead-name/lead-name.component";

@Component({
  templateUrl: './acting-for-same-address.component.html'
})
export class ActingForSameAddressComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'same-address';
  static title: string = "Do you have same address as PAP organisation? - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  sameAddressHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
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

  canContinue(): boolean {
    this.sameAddressHasErrors = !this.applicationService.currentAccountablePerson.ActingForSameAddress;
    return !this.sameAddressHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currentAccountablePerson.ActingForSameAddress == 'no') {
      return navigationService.navigateRelative(ActingForAddressComponent.route, activatedRoute);
    }

    return navigationService.navigateRelative(LeadNameComponent.route, activatedRoute);
  }

}
