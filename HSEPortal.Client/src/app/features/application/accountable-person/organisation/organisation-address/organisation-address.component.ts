import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PostcodeValidator } from 'src/app/helpers/validators/postcode-validator';
import { HttpClient } from '@angular/common/http';
import { GovukErrorSummaryComponent } from 'hse-angular';

@Component({
  selector: 'hse-organisation-address',
  templateUrl: './organisation-address.component.html'
})
export class OrganisationAddressComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'organisation-address';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;


  errors = {
    lineOneHasErrors: false,
    townOrCityHasErrors: false,
    postcode: { hasErrors: false, errorText: '' },
  }

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, private httpClient: HttpClient) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  override async saveAndContinue() {
    this.hasErrors = !await this.validateAndContinue();
    if (!this.hasErrors) {
      this.applicationService.updateLocalStorage();

      var hasNextPage = <IHasNextPage><unknown>this;
      if (hasNextPage) {
        await hasNextPage.navigateToNextPage(this.navigationService, this.activatedRoute);
      }
    }
  }

  private async validateAndContinue() {
    return true;
    // this.errors.lineOneHasErrors = !this.applicationService.currentAccountablePerson.AddressLineOne;
    // this.errors.townOrCityHasErrors = !this.applicationService.currentAccountablePerson.TownOrCity;

    // await this.validatePostcode();

    // return !this.errors.lineOneHasErrors && !this.errors.townOrCityHasErrors && !this.errors.postcode.hasErrors;
  }

  async validatePostcode() {
    return true;
    // let postcode = this.applicationService.currentAccountablePerson.Postcode;
    // this.errors.postcode.hasErrors = true;
    // if (!postcode) {
    //   this.errors.postcode.errorText = 'Enter a postcode';
    // } else if (!(await this.isPostcodeValid(postcode))) {
    //   this.errors.postcode.errorText = 'Enter a real postcode, like ‘EC3A 8BF’.';
    // } else {
    //   this.errors.postcode.hasErrors = false;
    // }
  }

  async isPostcodeValid(postcode: string): Promise<boolean> {
    return await new PostcodeValidator(this.httpClient).isValid(postcode).then((value: boolean) => {
      return value
    });
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigateRelative('organisation-job-role', activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }
}
