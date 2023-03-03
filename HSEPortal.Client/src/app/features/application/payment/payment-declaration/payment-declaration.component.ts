import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentComponent } from 'src/app/features/application/payment/payment/payment.component';

@Component({
  selector: 'hse-payment-declaration',
  templateUrl: './payment-declaration.component.html'
})
export class PaymentDeclarationComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'declaration';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, public paymentService: PaymentService) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PaymentComponent.route, activatedRoute);
  }

  saveAndComeBackLater() {

  }
}
