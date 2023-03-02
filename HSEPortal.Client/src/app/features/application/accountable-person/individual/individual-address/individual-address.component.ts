import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressSearchMode } from 'src/app/components/address/address.component';
import { SectionHelper } from 'src/app/helpers/section-name-helper';
import { AddressModel } from 'src/app/services/address.service';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { AddAccountablePersonComponent } from '../../add-accountable-person/add-accountable-person.component';
import { PapNameComponent } from '../pap-name/pap-name.component';

@Component({
  templateUrl: './individual-address.component.html'
})
export class IndividualAddressComponent {
  static route: string = 'individual-address';
  searchMode = AddressSearchMode.PostalAddress;

  constructor(private router: Router, private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
  }

  getAddressName() {
    if (this.applicationService.model.NumberOfSections == "one")
      return this.applicationService.model.BuildingName!;

    return this.applicationService.currentSection.Name ?? `${SectionHelper.getSectionCardinalName(this.applicationService._currentSectionIndex).toLowerCase()} section`;
  }

  async updateSectionAddress(address: AddressModel) {
    this.applicationService.currentAccountablePerson.Address = address;
    await this.applicationService.updateApplication();

    var userIsNotPrincipal = this.applicationService.currentAccountablePerson.IsPrincipal == 'no';
    this.navigationService.navigateRelative(userIsNotPrincipal ? PapNameComponent.route : `../${AddAccountablePersonComponent.route}`, this.activatedRoute);
  }
}
