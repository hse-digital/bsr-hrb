import { Component } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from "src/app/helpers/page.component";
import { ApplicationService, Status } from "src/app/services/application.service";
import { ApChangeCheckAnswersComponent } from "../ap-change-check-answers/ap-change-check-answers.component";

@Component({
  templateUrl: './same-pap.component.html'
})
export class SamePapComponent extends PageComponent<boolean> {
  static route: string = 'same-pap';
  static title: string = 'Confirm the principal accountable person has not changed - Register a high-rise building - GOV.UK';

  errorMessage: string = "";

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.model = this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewPap;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    if (!this.applicationService.model.RegistrationAmendmentsModel) {
      this.applicationService.model.RegistrationAmendmentsModel = {
        ConnectionStatus: Status.NoChanges,
        SubmitStatus: Status.NoChanges
      };
    }

    if (!this.applicationService.model.RegistrationAmendmentsModel!.AccountablePersonStatus) {
      this.applicationService.model.RegistrationAmendmentsModel!.AccountablePersonStatus = {
        Status: Status.NoChanges
      };
    }

    this.applicationService.model.RegistrationAmendmentsModel!.AccountablePersonStatus!.NewPap = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    if (!this.model) {
      this.errorMessage = `Select 'yes' if ${this.getPapName()} is still the principal accountable person.`;
      return false;
    }

    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.model == true) {
      return this.navigationService.navigateRelative(ApChangeCheckAnswersComponent.route, this.activatedRoute);
    }

    return this.navigationService.navigateRelative('../accountable-person', this.activatedRoute, { 'change': true });
  }

  private getPapName(): string {
    var papName = '';
    var pap = this.applicationService.model.AccountablePersons[0]!
    var isPapSelf = pap.IsPrincipal == 'yes';

    if (isPapSelf) {
      papName = `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
    } else {
      papName = `${pap.FirstName} ${pap.LastName}`;
    }

    return papName;
  }

  getPapNameDescription(): string {
    return `Is the principal accountable person still ${this.getPapName()}?`;
  }
}