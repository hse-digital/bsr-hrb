import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressSearchMode } from 'src/app/components/address/address.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { SectionHelper } from 'src/app/helpers/section-name-helper';
import { AddressModel } from 'src/app/services/address.service';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PapNameComponent } from '../pap-name/pap-name.component';

@Component({
  templateUrl: './individual-address.component.html'
})
export class IndividualAddressComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'individual-address';
  searchMode = AddressSearchMode.PostalAddress;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigateRelative('individual-check-answers', activatedRoute);
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
    this.navigationService.navigateRelative(userIsNotPrincipal ? PapNameComponent.route : '', this.activatedRoute);
  }
}
