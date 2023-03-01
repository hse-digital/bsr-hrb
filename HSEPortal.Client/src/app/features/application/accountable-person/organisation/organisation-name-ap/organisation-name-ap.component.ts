import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-organisation-name-ap',
  templateUrl: './organisation-name-ap.component.html',
  styleUrls: ['./organisation-name-ap.component.scss']
})
export class OrganisationNameApComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'organisation-name';
  autocompleteValues?: any;
  organisationNameHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, private httpClient: HttpClient) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.organisationNameHasErrors = !this.applicationService.currentAccountablePerson.OrganisationName;
    return !this.organisationNameHasErrors
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('organisation-address', activatedRoute);
  }

  async onInputDebounce() {
    this.autocompleteValues = await this.applicationService.getCompanyNames(this.applicationService.currentAccountablePerson?.OrganisationName);
  }

  saveAndComeBackLater() {

  }

}
