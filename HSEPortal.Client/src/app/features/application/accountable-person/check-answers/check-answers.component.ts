import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { PaymentDeclarationComponent } from 'src/app/features/application/payment/payment-declaration/payment-declaration.component';
import { PaymentModule } from 'src/app/features/application/payment/payment.module';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { PapNameService } from 'src/app/services/pap-name.service';

@Component({
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountablePersonCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers';
  static title: string = "Check your answers for PAP and AP - Register a high-rise building - GOV.UK";

  aps: AccountablePersonModel[] = [];
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, public papNameService: PapNameService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.aps = this.applicationService.model.AccountablePersons;
  }

  hasIncompleteData = false;
  canContinue(): boolean {
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

    this.hasIncompleteData = !canContinue;
    return canContinue;
  }

  override async onSave(): Promise<void> {
    await this.applicationService.syncAccountablePersons();
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.AccountablePersonsComplete;
    this.applicationService.updateApplication();

    if ((this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete) {
      return navigationService.navigateRelative(`..`, activatedRoute);
    }

    return navigationService.navigateRelative(`../${PaymentModule.baseRoute}/${PaymentDeclarationComponent.route}`, activatedRoute);
  }

  override canAccess(_: ActivatedRouteSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.AccountablePersonsInProgress) == BuildingApplicationStatus.AccountablePersonsInProgress;
  }

  navigateTo(url: string, apIndex: number) {
    this.navigationService.navigateRelative(`accountable-person-${apIndex + 1}/${url}`, this.activatedRoute, {
      return: 'check-answers'
    });
  }

  removeAp(ap: AccountablePersonModel, index: number) {
    this.applicationService.removeAp(index);
  }
}
