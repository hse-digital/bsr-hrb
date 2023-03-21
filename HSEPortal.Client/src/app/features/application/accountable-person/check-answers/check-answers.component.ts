import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { PaymentDeclarationComponent } from 'src/app/features/application/payment/payment-declaration/payment-declaration.component';
import { PaymentModule } from 'src/app/features/application/payment/payment.module';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { AccountablePersonModel, ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountablePersonCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers';

  aps: AccountablePersonModel[] = [];
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  ngOnInit(): void {
    this.aps = this.applicationService.model.AccountablePersons;
  }

  canContinue(): boolean {
    return true;
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

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.model.AccountablePersons && this.applicationService.model.AccountablePersons.length > 0;
  }
}
