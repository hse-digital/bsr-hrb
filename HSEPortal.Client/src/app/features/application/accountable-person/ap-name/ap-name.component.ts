import { Component, Input } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { ApplicationService } from "src/app/services/application.service";
import { ApDetailsComponent } from "../ap-details/ap-details.component";
import { PageComponent } from "src/app/helpers/page.component";

type AccountablePersonName = { FirstName?: string, LastName?: string}

@Component({
  selector: 'ap-name',
  templateUrl: './ap-name.component.html'
})
export class ApNameComponent extends PageComponent<AccountablePersonName> {
  static route: string = 'name';
  static title: string = "AP individual name - Register a high-rise building - GOV.UK";



  @Input() pap: boolean = false;
  @Input() nextRoute?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    this.model = {
      FirstName: this.applicationService.currentAccountablePerson.FirstName,
      LastName: this.applicationService.currentAccountablePerson.LastName,
    };
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.FirstName = this.model?.FirstName;
    this.applicationService.currentAccountablePerson.LastName = this.model?.LastName;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.firstNameInError = !this.model?.FirstName;
    this.lastNameInError = !this.model?.LastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(this.nextRoute ?? ApDetailsComponent.route, this.activatedRoute);
  }
}
