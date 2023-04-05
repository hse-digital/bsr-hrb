import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService, BuildingApplicationStatus, PaymentStatus } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountablePersonModule } from "../accountable-person/accountable-person.module";
import { NumberOfSectionsComponment } from "../number-of-sections/number-of-sections.component";
import { PaymentConfirmationComponent } from "../payment/payment-confirmation/payment-confirmation.component";
import { PaymentDeclarationComponent } from "../payment/payment-declaration/payment-declaration.component";
import { PaymentModule } from "../payment/payment.module";

@Component({
  templateUrl: './task-list.component.html'
})
export class ApplicationTaskListComponent extends BaseComponent implements OnInit {

  static route: string = '';
  static title: string = "Registration task list - Register a high-rise building - GOV.UK";

  applicationStatus = BuildingApplicationStatus;
  completedSections: number = 0;
  paymentEnum = PaymentStatus;
  paymentStatus?: PaymentStatus;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  checkingStatus = true;
  async ngOnInit(): Promise<void> {
    if (this.containsFlag(BuildingApplicationStatus.BlocksInBuildingComplete)) this.completedSections++;
    if (this.containsFlag(BuildingApplicationStatus.AccountablePersonsComplete)) {
      await this.getPaymentStatus();
      this.completedSections++;
    }
    if (this.containsFlag(BuildingApplicationStatus.PaymentComplete)) this.completedSections++;

    this.checkingStatus = false;
  }

  canContinue(): boolean {
    return true;
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.applicationService.model?.id !== undefined && this.applicationService.model?.id == routeSnapshot.params['id'];
  }

  navigateToSections() {
    let appendRoute = NumberOfSectionsComponment.route;

    if (this.applicationService.model.Sections?.length > 0) {
      appendRoute = 'sections/check-answers'
    }

    this.navigationService.navigateAppend(appendRoute, this.activatedRoute);
  }

  navigateToPap() {
    let appendRoute = AccountablePersonModule.baseRoute;

    if (this.applicationService.model.AccountablePersons?.length > 0) {
      appendRoute = 'accountable-person/check-answers'
    }

    this.navigationService.navigateAppend(appendRoute, this.activatedRoute);
  }

  navigateToPayment() {
    let appendRoute = PaymentModule.baseRoute;
    appendRoute = `${appendRoute}/${PaymentDeclarationComponent.route}`;

    this.navigationService.navigateAppend(appendRoute, this.activatedRoute);
  }

  containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

  async getPaymentStatus(): Promise<void> {
    var payments = await this.applicationService.getApplicationPayments();

    if (payments?.length > 0) {
      var successFulPayment = payments.find(x => x.bsr_govukpaystatus == 'success');

      if (successFulPayment) {
        this.paymentStatus = successFulPayment.bsr_paymentreconciliationstatus == 760_810_002 || successFulPayment.bsr_paymentreconciliationstatus == 760_810_003 ? PaymentStatus.Failed : PaymentStatus.Success;
      } else {
        this.paymentStatus = PaymentStatus.Failed;
      }
    } else if (this.containsFlag(BuildingApplicationStatus.PaymentInProgress)) {
      this.paymentStatus = PaymentStatus.Started;
    }
  }
}
