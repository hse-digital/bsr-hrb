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

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigateRelative('organisation-address', activatedRoute);
  }

  saveAndComeBackLater() {

  }

  autocompleteSelectedValue(event: any) {
    console.log(event);
    // Selected value on the autocomplete list.
  }

  debounceFunction() {
    console.log("debounce function")
    // Connection with the API.
    // Update autocompleteValues with the API result.
  }

  autocompleteValues = ["Dublin", "Madrid", "Barcelona", "Barcelota", "Barceloja", "Londres", "Paris", "Berlin"]
}
