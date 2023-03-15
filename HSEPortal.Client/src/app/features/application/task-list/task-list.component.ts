import { Component, OnInit, QueryList, Type, ViewChildren } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService, BuildingApplicationStatus } from "src/app/services/application.service";
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

  applicationStatus = BuildingApplicationStatus;
  completedSections: number = 0;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: Title) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (this.containsFlag(BuildingApplicationStatus.BlocksInBuildingComplete)) this.completedSections++;
    if (this.containsFlag(BuildingApplicationStatus.AccountablePersonsComplete)) this.completedSections++;
    if (this.containsFlag(BuildingApplicationStatus.PaymentComplete)) this.completedSections++;
  }

  canContinue(): boolean {
    return true;
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
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

    if ((this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete) {
      appendRoute = `${appendRoute}/${PaymentConfirmationComponent.route}`;
    } else {
      appendRoute = `${appendRoute}/${PaymentDeclarationComponent.route}`;
    }

    this.navigationService.navigateAppend(appendRoute, this.activatedRoute);
  }

  containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }
}
