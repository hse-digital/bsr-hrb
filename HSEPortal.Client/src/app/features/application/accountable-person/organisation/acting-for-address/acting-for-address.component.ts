import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { LeadNameComponent } from "../lead-name/lead-name.component";

@Component({
  templateUrl: './acting-for-address.component.html'
})
export class ActingForAddressComponent implements OnInit {
  static route: string = 'acting-for-address';
  searchMode = AddressSearchMode.PostalAddress;

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
  }

  address?: AddressModel
  ngOnInit(): void {
    this.address = this.applicationService.currentAccountablePerson.ActingForAddress;
  }

  async updateActingForAddress(address: AddressModel) {
    this.applicationService.currentAccountablePerson.ActingForAddress = address;
    await this.applicationService.updateApplication();

    this.navigationService.navigateRelative(LeadNameComponent.route, this.activatedRoute);
  }

}