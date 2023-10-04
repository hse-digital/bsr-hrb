import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { ApplicationService } from 'src/app/services/application.service';
import { OrganisationNameComponent } from '../organisation-name/organisation-name.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent extends PageComponent<string> implements AfterViewInit {
  static route: string = 'organisation-type';

  static title: string = "What is the PAP Organisation Type? - Register a high-rise building - GOV.UK";
  static apTitle: string = "AP Organisation Type - Register a high-rise building - GOV.UK";

  organisationTypeHasErrors = false;

  otherOptionModel?: string;


  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  ngAfterViewInit() {
    if (this.applicationService._currentAccountablePersonIndex > 0) {
      this.titleService.setTitle(OrganisationTypeComponent.apTitle);
    }
  }

  getPrincipalOrOther() {
    return !this.isPrincipal() ? 'Other' : 'Principal';
  }

  title() {
    return `${this.isPrincipal() ? 'Principal' : 'Other'} accountable person for ${this.applicationService.model.BuildingName}`;
  }

  isPrincipal() {
    return this.applicationService._currentAccountablePersonIndex == 0;
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentAccountablePerson.OrganisationType;
    this.otherOptionModel = this.applicationService.currentAccountablePerson.OrganisationTypeDescription
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.OrganisationType = this.model;
    this.applicationService.currentAccountablePerson.OrganisationTypeDescription = this.otherOptionModel;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.organisationTypeHasErrors = !this.model;
    return !this.organisationTypeHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(OrganisationNameComponent.route, this.activatedRoute);
  }
}