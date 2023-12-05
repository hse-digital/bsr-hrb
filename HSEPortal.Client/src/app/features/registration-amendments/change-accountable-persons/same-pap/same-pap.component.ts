import { Component } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AccountablePersonCheckAnswersComponent } from "src/app/features/application/accountable-person/check-answers/check-answers.component";
import { PageComponent } from "src/app/helpers/page.component";
import { ApplicationService, Status } from "src/app/services/application.service";

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
    this.applicationService.currentVersion.ApChangesStatus = this.model == false ? Status.ChangesInProgress : Status.NoChanges;
    if (!this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus) {
      this.applicationService.model.RegistrationAmendmentsModel!.AccountablePersonStatus = {
        Status: Status.NoChanges,
      }
    }

    this.applicationService.model.RegistrationAmendmentsModel!.AccountablePersonStatus!.NewPap = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    if (this.model == undefined) {
      this.errorMessage = `Select 'yes' if ${this.getPapName()} is still the principal accountable person.`;
      return false;
    }

    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.model == true) {
      return this.navigationService.navigateRelative(`../accountable-person/${AccountablePersonCheckAnswersComponent.route}`, this.activatedRoute);
    }

    this.applicationService.currentVersion.ApChangesStatus = Status.ChangesInProgress;
    return this.navigationService.navigateRelative('../accountable-person', this.activatedRoute);
  }

  private getPapName(): string {
    var papName = '';
    var pap = this.applicationService.currentVersion.AccountablePersons[0]!
    var isPapSelf = pap.IsPrincipal == 'yes';

    if (isPapSelf) {
      papName = `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
    } else {
      papName = pap.Type == "organisation" ? `${pap.OrganisationName}` : `${pap.FirstName} ${pap.LastName}`;
    }

    return papName;
  }

  getPapNameDescription(): string {
    return `Is the principal accountable person still ${this.getPapName()}?`;
  }
}
