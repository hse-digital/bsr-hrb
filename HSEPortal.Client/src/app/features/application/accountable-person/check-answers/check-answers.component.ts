import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PaymentDeclarationComponent } from 'src/app/features/application/payment/payment-declaration/payment-declaration.component';
import { PaymentModule } from 'src/app/features/application/payment/payment.module';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStage, Status } from 'src/app/services/application.service';
import { AccountabilityArea } from 'src/app/components/pap-accountability/pap-accountability.component';
import { AccountabilityAreasHelper } from 'src/app/helpers/accountability-areas-helper';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountablePersonCheckAnswersComponent extends PageComponent<void> {
  static route: string = 'check-answers';
  static title: string = "Check your answers for PAP and AP - Register a high-rise building - GOV.UK";

  checkAnswersArea = AccountabilityArea.CheckAnswers;
  apToRemove?: AccountablePersonModel;

  aps: AccountablePersonModel[] = [];
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  hasIncompleteData = false;

  override onInit(applicationService: ApplicationService): void {
    this.aps = this.applicationService.currentVersion.AccountablePersons;
    this.updateAddAnotherVariable(this.applicationService.currentVersion.AccountablePersons);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.AccountablePersonsInProgress) == BuildingApplicationStage.AccountablePersonsInProgress;
  }

  override isValid(): boolean {
    var canContinue = true;
    for (let index = 0; index < this.aps.length; index++) {
      var ap = this.aps[index];
      if (ap.Type == "organisation") {
        canContinue &&= (ap.PapAddress ?? ap.Address) != null;
        canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.OrganisationType);
        canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.OrganisationName);

        if (index == 0) {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.Role);
        }

        if (ap.Role == "employee" || ap.Role == "registering_for") {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadFirstName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadLastName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadJobRole);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadEmail);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadPhoneNumber);
        } else if (ap.Role == "named_contact") {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LeadJobRole);
        }

        if (ap.Role == "registering_for") {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.ActingForSameAddress);
          if (ap.ActingForSameAddress == "no") {
            canContinue &&= ap.ActingForAddress != null;
          }
        }

        if (index > 0) {
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.NamedContactFirstName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.NamedContactLastName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.NamedContactPhoneNumber);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.NamedContactEmail);
        }

      } else if (ap.Type == "individual") {
        if (ap.IsPrincipal == "yes") {
          canContinue &&= (ap.PapAddress ?? ap.Address) != null;
        } else {
          canContinue &&= ap.Address != null;
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.FirstName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.LastName);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.PhoneNumber);
          canContinue &&= FieldValidations.IsNotNullOrWhitespace(ap.Email);

          if (index == 0) {
            canContinue &&= ap.PapAddress != null;
          }
        }
      }

      if (index > 0) {
        canContinue &&= (ap.SectionsAccountability?.length ?? 0) > 0;
        canContinue &&= (ap.SectionsAccountability?.findIndex(x => (x.Accountability?.length ?? 0) > 0) ?? -1) > -1;
      }
    }

    canContinue &&= this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope).every(section => AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService.currentVersion.AccountablePersons, this.applicationService.model.BuildingName!, section).length == 0);

    this.hasIncompleteData = !canContinue;
    return canContinue;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.isChangeAmendmentInProgress) {
      return this.navigationService.navigateRelative(`../registration-amendments/change-task-list`, this.activatedRoute);
    }

    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStage.AccountablePersonsComplete;

    this.applicationService.updateApplication();

    if ((this.applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentComplete) == BuildingApplicationStage.PaymentComplete) {
      return this.navigationService.navigateRelative(`..`, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(`../${PaymentModule.baseRoute}/${PaymentDeclarationComponent.route}`, this.activatedRoute);
  }

  override async onSave(): Promise<void> {
    await this.applicationService.syncAccountablePersons();

    if (this.applicationService.isChangeAmendmentInProgress) {
      this.applicationService.currentVersion.ApChangesStatus = Status.ChangesComplete;
    }
  }

  navigateTo(url: string, apIndex: number) {
    this.navigationService.navigateRelative(`accountable-person-${apIndex + 1}/${url}`, this.activatedRoute, {
      return: 'check-answers'
    });
  }

  navigateToSamePAPscreen() {
    return this.navigationService.navigateRelative("../registration-amendments/same-pap", this.activatedRoute);
  }

  addAnotherAP() {
    return this.navigationService.navigateRelative('add-more', this.activatedRoute);
  }

  removeAp(ap: AccountablePersonModel, index: number) {
    if (this.applicationService.isChangeAmendmentInProgress) {
      this.apToRemove = ap;
    } else {
      this.applicationService.removeAp(index);
      this.updateAddAnotherVariable(this.applicationService.currentVersion.AccountablePersons);
    }
  }

  removeConfirmAp(confirm: boolean) {
    if (confirm) {
      this.applicationService.removeAp(this.applicationService.currentVersion.AccountablePersons.indexOf(this.apToRemove!));
      this.updateAddAnotherVariable(this.applicationService.currentVersion.AccountablePersons);
    }
    
    this.apToRemove = undefined;
  }

  private updateAddAnotherVariable(aps: AccountablePersonModel[]) {
    if (!!aps && aps.length > 1) {
      aps.slice(0, aps.length - 2).map(x => x.AddAnother = 'yes');
      if (!!aps.at(-1)) aps.at(-1)!.AddAnother = 'no';
    }
  }

  isRAinProgress(): any {
    return this.applicationService.isChangeAmendmentInProgress;
  }

  get previousPAPName() {
    return this.getPAPName(this.applicationService.previousVersion.AccountablePersons[0]);
  }

  private getPAPName(pap: AccountablePersonModel) {
    let individualName = pap.IsPrincipal == 'yes' && !FieldValidations.IsNotNullOrWhitespace(pap.FirstName) ? `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}` : `${pap.FirstName} ${pap.LastName}`;
    return pap.Type == 'organisation' ? pap.OrganisationName : individualName;
  }

  get isStillPapSentence() {
    return `Is ${this.previousPAPName} still the principal accountable person?`;
  }

  get nolongerAccountableSentence() {
    return `${this.previousPAPName} areas of accountability`;
  }

  get newPap() {
    return this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewPap;
  }
}
