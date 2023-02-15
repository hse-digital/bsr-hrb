import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PostcodeValidator } from 'src/app/helpers/validators/postcode-validator';

@Component({
  selector: 'hse-organisation-address',
  templateUrl: './organisation-address.component.html'
})
export class OrganisationAddressComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'organisation-address';

  errors = {
    lineOneHasErrors: false,
    townOrCityHasErrors: false,
    postcode: { hasErrors: false, errorText: '' },
  }

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.errors.lineOneHasErrors = !this.applicationService.currentAccountablePerson.AddressLineOne;
    this.errors.townOrCityHasErrors = !this.applicationService.currentAccountablePerson.TownOrCity;
    this.validatePostcode();
    return !this.errors.lineOneHasErrors && !this.errors.townOrCityHasErrors && !this.errors.postcode.hasErrors;
  }

  validatePostcode() {
    let postcode = this.applicationService.currentAccountablePerson.Postcode;
    this.errors.postcode.hasErrors = true;
    if (!postcode) {
      this.errors.postcode.errorText = 'Enter a postcode';
    } else if (!this.isPostcodeValid(postcode)) {
      this.errors.postcode.errorText = 'Enter a real postcode, like ‘EC3A 8BF’.';
    } else {
      this.errors.postcode.hasErrors = false;
    }
  }

  isPostcodeValid(postcode: string) {
    return new PostcodeValidator().isValid(postcode);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigateRelative('organisation-job-role', activatedRoute);
  }
}
