import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { ApplicationService, BuildingApplicationStatus, PaymentModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'hse-confirmation',
  templateUrl: './payment-confirmation.component.html',
})
export class PaymentConfirmationComponent implements OnInit, CanActivate {
  static route: string = "confirm";
  static title: string = "Registration complete confirmation - Register a high-rise building - GOV.UK";
  payment?: PaymentModel;
  shouldRender = false;

  constructor(public applicationService: ApplicationService, public paymentService: PaymentService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    await this.applicationService.syncPayment();

    var applicationStatus = this.applicationService.model.ApplicationStatus;
    if ((applicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete) {
      this.shouldRender = true;
      return;
    }

    if ((this.applicationService.model.Payments?.findIndex(x => x.Status == "success") ?? -1) > -1) {
      this.shouldRender = true;
      return;
    }

    this.activatedRoute.queryParams.subscribe(async query => {
      var paymentReference = query['reference'];
      var modelPayment = this.applicationService.model.Payments?.find(x => x.Reference == paymentReference);

      if (!paymentReference || !modelPayment) {
        this.navigationService.navigate(`/application/${this.applicationService.model.id}`);
        return;
      }

      this.payment = await this.paymentService.GetPayment(modelPayment!.PaymentId!);

      if (this.payment.Status == 'success') {
        this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.PaymentComplete;
        await this.applicationService.updateApplication();
        this.shouldRender = true;
      } else {
        this.navigationService.navigate(`/application/${this.applicationService.model.id}`);
      }
    });
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PaymentConfirmationComponent.route, activatedRoute);
  }

  notPap() {
    var pap = this.applicationService.model.AccountablePersons[0];
    return (pap.IsPrincipal == 'no' && pap.Type == 'individual') ||
      (pap.Type == 'organisation' && pap.Role == 'registering_for');
  }

  registerAnotherBuilding() {
    this.navigationService.navigate('');
  }

  canActivate(_: ActivatedRouteSnapshot) {
    var isInProgress = (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentInProgress) == BuildingApplicationStatus.PaymentInProgress;
    if (!isInProgress) {
      this.navigationService.navigate(NotFoundComponent.route);
      return false;
    }

    return true;
  }
}
