import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentDeclarationComponent } from 'src/app/features/application/payment/payment-declaration/payment-declaration.component';
import { PaymentModule } from 'src/app/features/application/payment/payment.module';

@Component({
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountablePersonCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers';
  static title: string = "Check your answers for PAP and AP - Register a high-rise building - GOV.UK";

  aps: AccountablePersonModel[] = [];
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.aps = this.applicationService.model.AccountablePersons;
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.AccountablePersonsComplete;
    this.applicationService.updateApplication();

    if ((this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete) {
      return navigationService.navigateRelative(`..`, activatedRoute);
    }

    return navigationService.navigateRelative(`../${PaymentModule.baseRoute}/${PaymentDeclarationComponent.route}`, activatedRoute);
  }
}
