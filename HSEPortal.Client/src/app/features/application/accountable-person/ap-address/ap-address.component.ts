import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { ApAccountableForComponent } from "../accountable-for/accountable-for.component";
import { AddAccountablePersonComponent } from "../add-accountable-person/add-accountable-person.component";
import { PapNameComponent } from "../ap-name/pap-name.component";
import { PapWhoAreYouComponent } from "../organisation/pap-who-are-you/pap-who-are-you.component";

@Component({
  selector: 'ap-address',
  templateUrl: './ap-address.component.html'
})
export class ApAddressComponent implements OnInit, CanActivate {
  static route: string = 'address';
  searchMode = AddressSearchMode.PostalAddress;

  @Input() addressName?: string;
  @Input() pap: boolean = false;
  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) { }

  private returnUrl?: string;
  address?: AddressModel;
  ngOnInit(): void {
    this.address = this.pap ? this.applicationService.currentAccountablePerson.PapAddress : this.applicationService.currentAccountablePerson.Address;
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['return'];
    });
  }

  getApName() {
    var currentAccountablePerson = this.applicationService.currentAccountablePerson;
    if ((currentAccountablePerson.Type == 'individual' && this.applicationService._currentAccountablePersonIndex > 0) || (this.applicationService._currentAccountablePersonIndex == 0 && this.applicationService.model.PrincipalAccountableType == 'individual')) {
      return `${currentAccountablePerson.FirstName} ${currentAccountablePerson.LastName}`;
    }

    return currentAccountablePerson.OrganisationName!;
  }

  isSelfAddress() {
    return !this.pap && this.applicationService._currentAccountablePersonIndex == 0;
  }

  async updateAddress(address: AddressModel) {
    if (this.pap) {
      this.applicationService.currentAccountablePerson.PapAddress = address;
    } else {
      this.applicationService.currentAccountablePerson.Address = address;
    }

    await this.applicationService.updateApplication();

    if (this.returnUrl) {
      this.navigationService.navigateRelative(`../${this.returnUrl}`, this.activatedRoute);
    } else if (this.applicationService._currentAccountablePersonIndex == 0) {
      this.navigateFirstAccountablePerson();
    } else {
      this.navigateOtherAccountablePersons();
    }
  }

  private navigateFirstAccountablePerson() {
    if (this.pap || this.applicationService.currentAccountablePerson.IsPrincipal == 'yes') {
      if (this.applicationService.currentAccountablePerson.Type == 'organisation') {
        this.navigationService.navigateRelative(PapWhoAreYouComponent.route, this.activatedRoute);
      } else {
        this.navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, this.activatedRoute);
      }
    } else {
      this.navigationService.navigateRelative(PapNameComponent.route, this.activatedRoute);
    }
  }

  private navigateOtherAccountablePersons() {
    this.navigationService.navigateRelative(ApAccountableForComponent.route, this.activatedRoute);
  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {    
    return this.applicationService.currentAccountablePerson.IsPrincipal == 'yes' ||
      ((this.applicationService.currentAccountablePerson.Type == "individual" && !!this.applicationService.currentAccountablePerson.Email && !!this.applicationService.currentAccountablePerson.PhoneNumber)
      || (this.applicationService.currentAccountablePerson.Type == "organisation" && !!this.applicationService.currentAccountablePerson.OrganisationName));
  }
}
