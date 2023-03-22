import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { PapAddressComponent } from '../../ap-address/pap-address.component';

@Component({
  templateUrl: './organisation-name.component.html'
})
export class OrganisationNameComponent extends BaseComponent implements IHasNextPage, AfterViewInit {
  static route: string = 'organisation-name';
  static title: string = "What is the PAP Organisation Name? - Register a high-rise building - GOV.UK";
  static apTitle: string = "AP Organisation Name - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  organisationNameHasErrors = false;
  organisationName?: string;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, private companiesService: CompaniesService, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngAfterViewInit() {
    if (this.applicationService._currentAccountablePersonIndex > 0) this.titleService.setTitle(OrganisationNameComponent.apTitle);
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

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(this.applicationService);
  }
}
