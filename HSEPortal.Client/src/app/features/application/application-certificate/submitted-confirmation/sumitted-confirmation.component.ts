import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { ApplicationService, PaymentModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'hse-submitted-confirmation',
  templateUrl: './submitted-confirmation.component.html',
})
export class SubmittedConfirmationComponent implements OnInit, CanActivate {
  static route: string = "confirm";
  static title: string = "Building assessment certificate application submitted - Register a high-rise building - GOV.UK";
  payment?: PaymentModel;
  shouldRender = false;
  submittionDate?: number;
  paymentType?: string;

  constructor(public applicationService: ApplicationService, public paymentService: PaymentService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.submittionDate = Date.now();
    this.sendApplicationDataToBroadcastChannel();

    this.paymentType = this.applicationService.model.ApplicationCertificate?.PaymentType;  

    if (this.paymentType == 'card') {
      // TODO
      // this.activatedRoute.queryParams.subscribe(async query => {
      //   var paymentReference = query['reference'] ?? await this.getApplicationPaymentReference();

      //   if (!paymentReference) {
      //     this.navigationService.navigate(`/application/${this.applicationService.model.id}`);
      //     return;
      //   }

      //   this.payment = await this.paymentService.GetPayment(paymentReference);
      //   if (this.payment.Status == 'success') {
      //     this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.PaymentComplete;
      //     await this.applicationService.updateApplication();
      //     this.shouldRender = true;
      //   } else {
      //     this.navigationService.navigate(`/application/${this.applicationService.model.id}`);
      //   }
      // });
    } else {
      this.shouldRender = true;
      this.payment = {
        Email: this.applicationService.model.PaymentInvoiceDetails?.Email
      }
    }
  }

  // TODO
  // private async getApplicationPaymentReference() {
  //   var payments = await this.applicationService.getApplicationPayments()
  //   return await payments.find(x => x.bsr_govukpaystatus == "success")?.bsr_transactionid;
  // }

  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel(this.applicationService.model.id!)
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
  }

  canActivate(_: ActivatedRouteSnapshot) {
    
    // TODO
    // const isInProgress = this.applicationService.model.ApplicationCertificate!.ApplicationStatus === ApplicationCertificateStage.PaymentInProgress;
    // if (!isInProgress) {
    //   this.navigationService.navigate(NotFoundComponent.route);
    //   return false;
    // }

    return true;
  }
}
