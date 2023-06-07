import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PaymentDeclarationComponent } from 'src/app/features/application/payment/payment-declaration/payment-declaration.component';
import { PaymentModule } from 'src/app/features/application/payment/payment.module';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, KbiSectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: './check-answers-building-information.component.html',
  styleUrls: ['./check-answers-building-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuildingInformationCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers-building-information';
  static title: string = "Check your building information answers - Register a high-rise building - GOV.UK";

/*  checkAnswersArea = AccountabilityArea.CheckAnswers;
*/


  kbiSection: KbiSectionModel = new KbiSectionModel;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.kbiSection = this.applicationService.currenKbiSection!;
  }

  hasIncompleteData = false;
  canContinue(): boolean {
    var canContinue = true;

    this.hasIncompleteData = !canContinue;
    return canContinue;
  }

  override async onSave(): Promise<void> {
    //await this.applicationService.syncAccountablePersons();
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
/*    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.AccountablePersonsComplete;
    
    this.applicationService.updateApplication();

    if ((this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete) {
      return navigationService.navigateRelative(`..`, activatedRoute);
    }*/

    //return navigationService.navigateRelative(`../${PaymentModule.baseRoute}/${PaymentDeclarationComponent.route}`, activatedRoute);
    return navigationService.navigateRelative(BuildingInformationCheckAnswersComponent.route, activatedRoute);

    //TODO navigate to connections
  }

  override canAccess(_: ActivatedRouteSnapshot): boolean {
    return true;
  }

  navigateTo(url: string, apIndex: number) {
/*    this.navigationService.navigateRelative(`accountable-person-${apIndex + 1}/${url}`, this.activatedRoute, {
      return: 'check-answers'
    });*/
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }
}
