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
    this.shouldRender = true;
    this.payment = {
      Email: this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails?.Email
    }

    await this.applicationService.syncBAC();
  }

  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel(this.applicationService.model.id!)
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
  }

  canActivate(_: ActivatedRouteSnapshot) {
    return this.applicationService.model.ApplicationCertificate?.PaymentType !== undefined;
  }
}
