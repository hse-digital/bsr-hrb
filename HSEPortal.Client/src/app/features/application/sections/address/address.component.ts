import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { SectionOtherAddressesComponent } from "../other-addresses/other-addresses.component";

@Component({
    templateUrl: './address.component.html'
})
export class SectionAddressComponent extends BaseComponent {
    static route: string = 'address';
    searchMode = AddressSearchMode.Building;

    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    async updateSectionAddress(address: AddressModel) {
        this.applicationService.currentSection.Address = address;

        await this.applicationService.updateApplication();

        this.navigationService.navigateRelative(SectionOtherAddressesComponent.route, this.activatedRoute);
    }

    canContinue(): boolean {
        return true;
    }

}