import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { AddressModel } from 'src/app/services/address.service';
import { PapWhoAreYouComponent } from '../pap-who-are-you/pap-who-are-you.component';
import { AddressSearchMode } from 'src/app/components/address/address.component';

@Component({
  selector: 'hse-organisation-address',
  templateUrl: './organisation-address.component.html'
})
export class OrganisationAddressComponent {
  static route: string = 'organisation-address';
  searchMode = AddressSearchMode.Building;

  address?: AddressModel
  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
  }

  private returnUrl?: string;
  ngOnInit(): void {
    this.address = this.applicationService.currentAccountablePerson.Address;
    this.activatedRoute.queryParams.subscribe(query => {
      this.returnUrl = query['return'];
    })
  }

  async updateOrganisationAddress(address: AddressModel) {
    this.applicationService.currentAccountablePerson.ActingForAddress = address;
    await this.applicationService.updateApplication();

    let route = PapWhoAreYouComponent.route;
    if (this.returnUrl) {
      route = `../${this.returnUrl}`;
    }

    this.navigationService.navigateRelative(route, this.activatedRoute);
  }
}
