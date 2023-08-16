import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { ApplicationService } from "src/app/services/application.service";
import { AddAccountablePersonComponent } from "../../add-accountable-person/add-accountable-person.component";
import { PageComponent } from "src/app/helpers/page.component";

@Component({
  templateUrl: './pap-named-role.component.html'
})
export class PapNamedRoleComponent extends PageComponent<string> {
  static route: string = 'pap-named-role';
  static title: string = "What is your job role at PAP organisation? - Register a high-rise building - GOV.UK";



  namedRoleHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentAccountablePerson.LeadJobRole;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.LeadJobRole = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.namedRoleHasErrors = !this.model;
    return !this.namedRoleHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, this.activatedRoute);
  }

}
