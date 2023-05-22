import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { NotFoundComponent } from "src/app/components/not-found/not-found.component";
import { SectionHelper } from "src/app/helpers/section-helper";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { AddMoreSectionsComponent } from "../add-more-sections/add-more-sections.component";
import { SectionCheckAnswersComponent } from "../check-answers/check-answers.component";
import { SectionNameComponent } from "../name/name.component";
import { SectionOtherAddressesComponent } from "../other-addresses/other-addresses.component";
import { ApplicationSubmittedHelper } from "src/app/helpers/app-submitted-helper";

@Component({
  templateUrl: './address.component.html'
})
export class SectionAddressComponent implements OnInit, CanActivate {
  static route: string = 'address';

  static title: string = 'Find the address of the section - Register a high-rise building - GOV.UK';
  static selectTitle: string = 'Select the section address - Register a high-rise building - GOV.UK';
  static confirmTitle: string = 'Confirm the section address - Register a high-rise building - GOV.UK';

  searchMode = AddressSearchMode.Building;

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute, private titleService: TitleService) {
  }

  private addressIndex?: number;
  private returnUrl?: string;
  address?: AddressModel;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      this.addressIndex = query['address'];
      this.returnUrl = query['return'];
      if (this.addressIndex) {
        this.address = this.applicationService.currentSection.Addresses[this.addressIndex - 1];
      }
    });
  }

  async updateSectionAddress(address: AddressModel) {
    if (this.addressIndex) {
      this.applicationService.currentSection.Addresses[this.addressIndex - 1] = address;
    } else {
      if (!this.applicationService.currentSection.Addresses)
        this.applicationService.currentSection.Addresses = [];

      this.applicationService.currentSection.Addresses.push(address);
    }
    await this.applicationService.updateApplication();

    if (this.returnUrl) {
      this.navigationService.navigateRelative(`../${this.returnUrl}`, this.activatedRoute);
    } else if (this.applicationService.currentSection.Addresses.length < 5) {
      this.navigationService.navigateRelative(SectionOtherAddressesComponent.route, this.activatedRoute);
    } else {
      if (this.applicationService.model.NumberOfSections == 'one') {
        this.navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, this.activatedRoute);
      } else if (this.applicationService.model.Sections.length > 1) {
        this.navigationService.navigateRelative(`../${AddMoreSectionsComponent.route}`, this.activatedRoute);
      } else {
        var nextSection = this.applicationService.startNewSection();
        await this.applicationService.updateApplication();
        this.navigationService.navigateRelative(`../${nextSection}/${SectionNameComponent.route}`, this.activatedRoute);
      }
    }
  }

  getAddressSectionName() {
    if (this.applicationService.model.NumberOfSections == "one")
      return this.applicationService.model.BuildingName!;

    return this.applicationService.currentSection.Name!;
  }

  changeStep(event: any) {
    switch (event) {
      case "select": this.titleService.setTitle(SectionAddressComponent.selectTitle);
        return;
      case "confirm": this.titleService.setTitle(SectionAddressComponent.confirmTitle);
        return;
    }
    this.titleService.setTitle(SectionAddressComponent.title);
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot) {

    ApplicationSubmittedHelper.navigateToPaymentConfirmationIfAppSubmitted(this.applicationService, this.navigationService);

    if (!SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService)) {
      this.navigationService.navigate(NotFoundComponent.route);
      return false;
    }

    return true;
  }

}