import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'hse-confirmation',
  templateUrl: './payment-confirmation.component.html',
})
export class PaymentConfirmationComponent implements OnInit {
  static route: string = "confirm";

  constructor(public applicationService: ApplicationService, public paymentService: PaymentService, private navigationService: NavigationService) {
  }

  async ngOnInit() {
    this.applicationService.model.Payment =  await this.paymentService.GetPayment(this.applicationService.model.Payment!.PaymentId!)
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.PaymentComplete;

    await this.applicationService.updateApplication();
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PaymentConfirmationComponent.route, activatedRoute);
  }

  notPap() {
    var pap = this.applicationService.model.AccountablePersons[0];
    return pap.IsPrincipal == 'no' && pap.Type == 'individual';
  }

  registerAnotherBuilding() {
    this.navigationService.navigate('');
  }

}
