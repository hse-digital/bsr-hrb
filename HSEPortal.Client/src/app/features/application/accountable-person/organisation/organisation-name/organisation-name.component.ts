import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { ApplicationService } from 'src/app/services/application.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { PapAddressComponent } from '../../ap-address/pap-address.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './organisation-name.component.html'
})
export class OrganisationNameComponent extends PageComponent<string> {
  static route: string = 'organisation-name';
  static title: string = "What is the PAP Organisation Name? - Register a high-rise building - GOV.UK";
  static apTitle: string = "AP Organisation Name - Register a high-rise building - GOV.UK";

  constructor(private companiesService: CompaniesService, activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (applicationService._currentAccountablePersonIndex > 0) {
      this.titleService.setTitle(OrganisationNameComponent.apTitle);
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.currentAccountablePerson.OrganisationName = this.model;
  }

  organisationNameHasErrors = false;
  override isValid(): boolean {
    this.organisationNameHasErrors = !this.model;
    return !this.organisationNameHasErrors
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(PapAddressComponent.route, this.activatedRoute);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot) {
    return ApHelper.isApAvailable(routeSnapshot, applicationService) && ApHelper.isOrganisation(routeSnapshot, applicationService);
  }

  companies: string[] = [];
  async searchCompanies(company: string) {
    if (company?.length > 2) {
      var response = await this.companiesService.SearchCompany(company, this.currentAccountablePerson.OrganisationType!);
      this.companies = response.Companies.map(x => x.Name);
    }
  }

  selectCompanyName(company: string) {
    this.currentAccountablePerson.OrganisationName = company;
  }

  getPrincipalOrOther() {
    return this.currentAccountablePersonIndex > 0 ? 'Other' : 'Principal';
  }

  title() {
    return `${this.currentAccountablePersonIndex == 0 ? 'Principal' : 'Other'} accountable person for ${this.applicationModel.BuildingName}`;
  }
}
