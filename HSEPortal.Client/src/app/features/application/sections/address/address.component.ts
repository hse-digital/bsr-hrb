import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { SectionOtherAddressesComponent } from "../other-addresses/other-addresses.component";
import { SectionCheckAnswersComponent } from "../check-answers/check-answers.component";
import { AddMoreSectionsComponent } from "../add-more-sections/add-more-sections.component";
import { SectionNameComponent } from "../name/name.component";
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: './address.component.html'
})
export class SectionAddressComponent implements OnInit {
  static route: string = 'address';

  // Move to Address component
  static title: string = "Find the address of the section - Register a high-rise building - GOV.UK";

  searchMode = AddressSearchMode.Building;

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute, titleService: TitleService) {
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

}
