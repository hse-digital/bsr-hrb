import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { LeadNameComponent } from "../lead-name/lead-name.component";

@Component({
  templateUrl: './acting-for-address.component.html'
})
export class ActingForAddressComponent implements OnInit, CanActivate {
  static route: string = 'acting-for-address';
  searchMode = AddressSearchMode.PostalAddress;

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
  }

  address?: AddressModel
  private returnUrl?: string;
  ngOnInit(): void {
    this.address = this.applicationService.currentAccountablePerson.ActingForAddress;
    this.activatedRoute.queryParams.subscribe(query => {
      this.returnUrl = query['return'];
    })
  }

  async updateActingForAddress(address: AddressModel) {
    this.applicationService.currentAccountablePerson.ActingForAddress = address;
    await this.applicationService.updateApplication();

    let route = LeadNameComponent.route;
    if (this.returnUrl) {
      route = `../${this.returnUrl}`;
    }

    this.navigationService.navigateRelative(route, this.activatedRoute);
  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.IsPrincipal && this.applicationService.currentAccountablePerson.IsPrincipal == 'no' &&
      !!this.applicationService.currentAccountablePerson.Role && this.applicationService.currentAccountablePerson.Role == "registering_for";
  }
}
