import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SocialHousingOrganisationService } from 'src/app/services/social-housing-organisation.service';
import { ApAddressComponent } from '../../ap-address/ap-address.component';
import { PapAddressComponent } from '../../ap-address/pap-address.component';

@Component({
  templateUrl: './organisation-name.component.html'
})
export class OrganisationNameComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'organisation-name';

  organisationNameHasErrors = false;
  organisationName?: string;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, private companiesService: CompaniesService, private socialHousingOrganisationService: SocialHousingOrganisationService) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.organisationNameHasErrors = !this.applicationService.currentAccountablePerson.OrganisationName;
    return !this.organisationNameHasErrors
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let route = PapAddressComponent.route;
    if (this.applicationService._currentAccountablePersonIndex > 0) {
      route = ApAddressComponent.route;
    }

    return navigationService.navigateRelative(route, activatedRoute);
  }

  companies: string[] = [];
  async searchCompanies(company: string) {    
    switch (this.applicationService?.currentAccountablePerson?.OrganisationType) {
      case "housing-association":
        this.companies = this.socialHousingOrganisationService.getNamesBy(company);
        return;
      case "local-authority": return; 
    }    
    var response = await this.companiesService.SearchCompany(company);
    this.companies = response.Companies.map(x => x.Name);
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
}
