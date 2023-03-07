import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { SectionOtherAddressesComponent } from "../other-addresses/other-addresses.component";
import { SectionHelper } from "src/app/helpers/section-name-helper";

@Component({
    templateUrl: './address.component.html'
})
export class SectionAddressComponent implements OnInit {
    static route: string = 'address';
    searchMode = AddressSearchMode.Building;

    constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
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
        } else {
            this.navigationService.navigateRelative(SectionOtherAddressesComponent.route, this.activatedRoute);
        }
    }

    getAddressSectionName() {
        if (this.applicationService.model.NumberOfSections == "one")
            return this.applicationService.model.BuildingName!;

        return this.applicationService.currentSection.Name!;
    }

}