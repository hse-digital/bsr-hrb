import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-section-address',
  templateUrl: './section-address.component.html',
  styleUrls: ['./section-address.component.scss']
})
export class SectionAddressComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'address';
  public selectedAddress?: string;
  public address?: string;
  public addresses?: string[];

  private history: string[] = [];

  step = 'find';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  addressHasErrors = false;

  canContinue(): boolean {
    let address = this.applicationService.currentSection.Address;
    this.addressHasErrors = !address || !this.addressConfirmed;
    return !this.addressHasErrors;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.Address;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionAddressComponent.route, activatedRoute);
  }

  addressConfirmed() {
    this.saveAndContinue();
  }

  findAddress(find: { input: string, addresses: string[] | undefined }) {
    console.log(find);
    this.address = find.input;
    if (find.addresses && find.addresses.length > 0) {
      this.addresses = find.addresses;
      this.changeStepTo(find.addresses.length < 100 ? "select" : "too-many");
    } else {
      this.changeStepTo("not-found");
    }
  }

  selectAddress(selectedAddress: any) {
    this.selectedAddress = selectedAddress;
    this.changeStepTo('confirm');
  }

  searchAgain() {
    this.changeStepTo('find');
  }

  enterManualAddress() {
    this.changeStepTo('manual');
  }

  manualAddress(manualAddress: { AddressLineOne?: string, AddressLineTwo?: string, TownOrCity?: string, Postcode?: string }) {
    this.selectedAddress = `${manualAddress.AddressLineOne}, ${manualAddress.Postcode}`;
    this.changeStepTo('confirm');
  }

  changeStepTo(step: string) {
    this.history.push(this.step);
    this.step = step;
  }

  navigateBack() {
    let previousStep = this.history.pop();
    this.step = previousStep ?? "find";
    if (!previousStep) history.back();
  }

}
