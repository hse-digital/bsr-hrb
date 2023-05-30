import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { OrganisationNameComponent } from '../organisation-name/organisation-name.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent extends PageComponent<ApOrganisationType> {
  static route: string = 'organisation-type';

  static title: string = "What is the PAP Organisation Type? - Register a high-rise building - GOV.UK";
  static apTitle: string = "AP Organisation Type - Register a high-rise building - GOV.UK";

  override onInit(applicationService: ApplicationService): void {
    if (applicationService._currentAccountablePersonIndex > 0) {
      this.titleService.setTitle(OrganisationTypeComponent.apTitle);
    }

    this.model = {
      organisationType: applicationService.currentAccountablePerson.OrganisationType,
      organisationTypeDescription: applicationService.currentAccountablePerson.OrganisationType
    };
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.currentAccountablePerson.OrganisationType = this.model?.organisationType;
    applicationService.currentAccountablePerson.OrganisationTypeDescription = this.model?.organisationTypeDescription;
  }

  organisationTypeHasErrors = false;
  override isValid(): boolean {
    this.organisationTypeHasErrors = !this.model?.organisationType;
    return !this.organisationTypeHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(OrganisationNameComponent.route, this.activatedRoute);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot) {
    return ApHelper.isApAvailable(routeSnapshot, applicationService) && ApHelper.isOrganisation(routeSnapshot, applicationService);
  }

  getPrincipalOrOther() {
    return !this.isPrincipal() ? 'Other' : 'Principal';
  }

  title() {
    return `${this.isPrincipal() ? 'Principal' : 'Other'} accountable person for ${this.applicationModel.BuildingName}`;
  }

  isPrincipal() {
    return this.currentAccountablePersonIndex == 0;
  }
}

class ApOrganisationType {
  organisationType?: string;
  organisationTypeDescription?: string;
}