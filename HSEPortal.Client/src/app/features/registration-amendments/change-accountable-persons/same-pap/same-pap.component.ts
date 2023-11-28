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
    this.model = this.applicationService.model.RegistrationAmendmentsModel?.ChangeAccountablePerson?.NewPap;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    if (!this.applicationService.model.RegistrationAmendmentsModel) {
      this.applicationService.model.RegistrationAmendmentsModel = {
        ConnectionStatus: Status.NoChanges,
        SubmitStatus: Status.NoChanges
      };
    }

    if (!this.applicationService.model.RegistrationAmendmentsModel!.ChangeAccountablePerson) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeAccountablePerson = {
        Status: Status.NoChanges
      };
    }

    this.applicationService.model.RegistrationAmendmentsModel!.ChangeAccountablePerson!.NewPap = this.model;
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

    return this.navigationService.navigateRelative('../accountable-person', this.activatedRoute);
  }

  private getPapName(): string {
    var papName = '';
    var pap = this.applicationService.currentVersion.AccountablePersons[0]!
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