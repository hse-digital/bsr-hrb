import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { ApplicationService, BuildingApplicationStage, PaymentModel } from 'src/app/services/application.service';
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
  submittionDate?: number;

  constructor(public applicationService: ApplicationService, public paymentService: PaymentService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.submittionDate = Date.now();
    this.sendApplicationDataToBroadcastChannel();

    if (this.applicationService.model.PaymentType == 'card') {
      this.activatedRoute.queryParams.subscribe(async query => {
        var paymentReference = query['reference'] ?? await this.getApplicationPaymentReference();

        if (!paymentReference) {
          this.navigationService.navigate(`/application/${this.applicationService.model.id}`);
          return;
        }

        this.payment = await this.paymentService.GetPayment(paymentReference);
        if (this.payment.Status == 'success') {
          this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.PaymentComplete;
          await this.applicationService.updateApplication();
          this.shouldRender = true;
        } else {
          this.navigationService.navigate(`/application/${this.applicationService.model.id}`);
        }
      });
    } else {
      this.shouldRender = true;
      this.payment = {
        Email: this.applicationService.model.PaymentInvoiceDetails?.Email
      }
    }
  }

  private async getApplicationPaymentReference() {
    var payments = await this.applicationService.getApplicationPayments()
    return await payments.find(x => x.bsr_govukpaystatus == "success")?.bsr_transactionid;
  }

  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel(this.applicationService.model.id!)
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PaymentConfirmationComponent.route, activatedRoute);
  }

  notPap() {
    var pap = this.applicationService.currentVersion.AccountablePersons[0];
    return (pap.IsPrincipal == 'no' && pap.Type == 'individual') ||
      (pap.Type == 'organisation' && pap.Role == 'registering_for');
  }

  registerAnotherBuilding() {
    this.navigationService.navigate('');
  }

  canActivate(_: ActivatedRouteSnapshot) {
    var isInProgress = (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentInProgress) == BuildingApplicationStage.PaymentInProgress;
    if (!isInProgress) {
      this.navigationService.navigate(NotFoundComponent.route);
      return false;
    }

    return true;
  }

  async continueToKbi() {
    await this.navigationService.navigateRelative("../kbi", this.activatedRoute);
  }

  get28DaysAfterSubmittionDate() {
    let date = new Date(this.submittionDate!);
    return date!.setDate(date!.getDate() + 28);
  }

}
