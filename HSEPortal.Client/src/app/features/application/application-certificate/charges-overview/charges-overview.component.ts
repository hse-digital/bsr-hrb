import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { InvoicingDetailsComponent } from '../invoicing-details/invoicing-details.component';

@Component({
  selector: 'hse-charges-overview',
  templateUrl: './charges-overview.component.html',
})
export class ChargesOverviewComponent extends PageComponent<void> {
  static route: string = 'charges-overview';
  static title: string =
    'Charges for assessing your building assessment certificate application - Register a high-rise building - GOV.UK';

  applicationCharge?: number;
  perPersonPerHourCharge?: number;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    const appCharges = await applicationService.getApplicationCost();
    this.applicationCharge = appCharges.CertificateCharges?.ApplicationCharge ?? 0;
    this.perPersonPerHourCharge = appCharges.CertificateCharges?.PerPersonPerHourCharge ?? 0;
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> {
  }

  override canAccess(): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(InvoicingDetailsComponent.route, this.activatedRoute);
  }
}
