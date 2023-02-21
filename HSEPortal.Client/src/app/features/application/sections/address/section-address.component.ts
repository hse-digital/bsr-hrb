import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-section-address',
  templateUrl: './section-address.component.html'
})
export class SectionAddressComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'address';

  addressConfirmed: boolean = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    let address = this.applicationService.currentSection.Address;
    return this.addressConfirmed && !!address;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.Address;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionAddressComponent.route, activatedRoute);
  }

  onAddressConfirmed() {
    this.addressConfirmed = true;
    this.saveAndContinue();
  }
}
