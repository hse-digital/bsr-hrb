import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { ApplicationService } from "src/app/services/application.service";
import { ApAddressComponent } from "../ap-address/ap-address.component";
import { PageComponent } from "src/app/helpers/page.component";

@Component({
  templateUrl: './principal.component.html'
})
export class PrincipleAccountableSelection extends PageComponent<string> {
  static route: string = 'principal';
  static title: string = "Are you the PAP? - Register a high-rise building - GOV.UK";



  principalHasErrors = false;
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentAccountablePerson.IsPrincipal;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.IsPrincipal = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService) && this.applicationService.currentAccountablePerson.Type == "individual";
  }

  override isValid(): boolean {
    this.principalHasErrors = !this.model;
    return !this.principalHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ApAddressComponent.route, this.activatedRoute);
  }
}
