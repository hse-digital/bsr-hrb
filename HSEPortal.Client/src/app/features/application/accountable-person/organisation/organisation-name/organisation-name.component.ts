import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PapAddressComponent } from '../../ap-address/pap-address.component';

@Component({
  templateUrl: './organisation-name.component.html'
})
export class OrganisationNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'organisation-name';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

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

  companies: string[] = [];
  async searchCompanies(company: string) {
    if (company?.length > 2) {
      var response = await this.companiesService.SearchCompany(company, this.applicationService.currentAccountablePerson.OrganisationType!);
      this.companies = response.Companies.map(x => x.Name);
    }
  }

  selectCompanyName(company: string) {
    this.applicationService.currentAccountablePerson.OrganisationName = company;
  }

  getPrincipalOrOther() {
    return this.applicationService._currentAccountablePersonIndex > 0 ? 'Other' : 'Principal';
  }

  title() {
    return `${this.applicationService._currentAccountablePersonIndex == 0 ? 'Principal' : 'Other'} accountable person for ${this.applicationService.model.BuildingName}`;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.OrganisationType;
  }
}
