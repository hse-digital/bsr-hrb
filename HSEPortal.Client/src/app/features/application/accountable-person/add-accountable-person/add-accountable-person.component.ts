import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { AccountablePersonTypeComponent } from './accountable-person-type.component';
import { AreasAccountabilityComponent } from '../areas-accountability/areas-accountability.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-add-accountable-person',
  templateUrl: './add-accountable-person.component.html',
})
export class AddAccountablePersonComponent extends PageComponent<string> {
  static route: string = 'add-more';
  static title: string = "Add another accountable person - Register a high-rise building - GOV.UK";
  

  
  addAccountablePersonHasError = false;
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentAccountablePerson.AddAnother;    
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.AccountablePersonsInProgress;
    
    this.applicationService.updateApplication();
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.AddAnother = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.applicationService.model.AccountablePersons?.length >= 1;
  }

  override isValid(): boolean {
    this.addAccountablePersonHasError = !this.model;
    return !this.addAccountablePersonHasError;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentAccountablePerson.AddAnother == 'yes') {
      let newAp = this.applicationService.startNewAccountablePerson();
      return this.navigationService.navigateRelative(`${newAp}/${AccountablePersonTypeComponent.route}`, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(AreasAccountabilityComponent.route, this.activatedRoute);
  }

  principalName() {
    var pap = this.applicationService.model.AccountablePersons[0];
    if (pap.Type == 'organisation') return pap.OrganisationName;

    if (pap.IsPrincipal == 'yes') {
      if (pap.Type == 'individual')
        return `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
    }

    return `${pap.FirstName} ${pap.LastName}`;
  }

  otherAps() {
    var aps = this.applicationService.model.AccountablePersons;
    return aps.slice(1, aps.length).filter(ap => ap.FirstName !== undefined || ap.LastName !== undefined || ap.OrganisationName !== undefined);
  }

  apName(ap: AccountablePersonModel) {
    if (ap.Type == 'organisation')
      return ap.OrganisationName;

    return `${ap.FirstName} ${ap.LastName}`;
  }
}
