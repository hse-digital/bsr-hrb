import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-organisation-named-contact-ap',
  templateUrl: './organisation-named-contact-ap.component.html',
  styleUrls: ['./organisation-named-contact-ap.component.scss']
})
export class OrganisationNamedContactApComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'organisation-named-contact';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.applicationService.currentAccountablePerson.OrganisationNamedContactFirstName;
    this.lastNameInError = !this.applicationService.currentAccountablePerson.OrganisationNamedContactLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigateRelative('organisation-job-role', activatedRoute);
  }

  saveAndExit(event: any) {
    event.preventDefault();
  }

}
