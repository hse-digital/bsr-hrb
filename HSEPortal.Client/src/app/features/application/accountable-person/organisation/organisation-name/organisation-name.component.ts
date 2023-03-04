import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApAddressComponent } from '../../ap-address/ap-address.component';
import { PapAddressComponent } from '../../ap-address/pap-address.component';

@Component({
  templateUrl: './organisation-name.component.html'
})
export class OrganisationNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'organisation-name';

  organisationNameHasErrors = false;
  organisationName?: string;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, private companiesService: CompaniesService) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.organisationNameHasErrors = !this.applicationService.currentAccountablePerson.OrganisationName;
    return !this.organisationNameHasErrors
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PapAddressComponent.route, activatedRoute);
  }

  saveAndComeBackLater() {

  }

  companies: string[] = [];
  async searchCompanies(company: string) {
    var response = await this.companiesService.SearchCompany(company);
    this.companies = response.Companies.map(x => x.Name);
  }

  selectCompanyName(company: string) {
    this.applicationService.currentAccountablePerson.OrganisationName = company;
  }
}
