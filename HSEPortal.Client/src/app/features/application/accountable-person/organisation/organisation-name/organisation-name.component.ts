import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { ApplicationService } from 'src/app/services/application.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { PapAddressComponent } from '../../ap-address/pap-address.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './organisation-name.component.html'
})
export class OrganisationNameComponent extends PageComponent<string> implements AfterViewInit {
  static route: string = 'organisation-name';
  static title: string = "What is the PAP Organisation Name? - Register a high-rise building - GOV.UK";
  static apTitle: string = "AP Organisation Name - Register a high-rise building - GOV.UK";



  organisationNameHasErrors = false;
  organisationName?: string;
  constructor(activatedRoute: ActivatedRoute, private companiesService: CompaniesService) {
    super(activatedRoute);
  } 

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentAccountablePerson.OrganisationName;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.OrganisationName = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.organisationNameHasErrors = !this.model;
    return !this.organisationNameHasErrors
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(PapAddressComponent.route, this.activatedRoute);
  }

  ngAfterViewInit() {
    if (this.applicationService._currentAccountablePersonIndex > 0) this.titleService.setTitle(OrganisationNameComponent.apTitle);
  }

  companies: string[] = [];
  async searchCompanies(company: string) {
    if (company?.length > 2) {
      var response = await this.companiesService.SearchCompany(company, this.applicationService.currentAccountablePerson.OrganisationType!);
      this.companies = response.Companies.map(x => x.Name);
    }
  }

  selectCompanyName(company: string) {
    this.model = company;
  }

  getPrincipalOrOther() {
    return this.applicationService._currentAccountablePersonIndex > 0 ? 'Other' : 'Principal';
  }

  title() {
    return `${this.applicationService._currentAccountablePersonIndex == 0 ? 'Principal' : 'Other'} accountable person for ${this.applicationService.model.BuildingName}`;
  }
}