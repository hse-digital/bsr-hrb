import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { ApHelper } from "src/app/helpers/ap-helper";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from "src/app/services/title.service";
import { LeadNameComponent } from "../lead-name/lead-name.component";

@Component({
    templateUrl: './acting-for-address.component.html'
})
export class ActingForAddressComponent implements OnInit, CanActivate {
    static route: string = 'acting-for-address';

    static title: string = "Find your address - Register a high-rise building - GOV.UK";
    static selectTitle: string = "Select your address - Register a high-rise building - GOV.UK";
    static confirmTitle: string = "Confirm your address - Register a high-rise building - GOV.UK";

    searchMode = AddressSearchMode.PostalAddress;

    constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute, private titleService: TitleService) {
    }

    address?: AddressModel
    private returnUrl?: string;
    ngOnInit(): void {
        this.address = this.applicationService.currentAccountablePerson.ActingForAddress;
        this.activatedRoute.queryParams.subscribe(query => {
            this.returnUrl = query['return'];
        })
    }

    async updateActingForAddress(address: AddressModel) {
        this.applicationService.currentAccountablePerson.ActingForAddress = address;
        await this.applicationService.updateApplication();

        let route = LeadNameComponent.route;
        if (this.returnUrl) {
            route = `../${this.returnUrl}`;
        }

        this.navigationService.navigateRelative(route, this.activatedRoute);
    }

    changeStep(event: any) {
        switch (event) {
            case "select": this.titleService.setTitle(ActingForAddressComponent.selectTitle);
                return;
            case "confirm": this.titleService.setTitle(ActingForAddressComponent.confirmTitle);
                return;
        }
        this.titleService.setTitle(ActingForAddressComponent.title);
    }

    canActivate(routeSnapshot: ActivatedRouteSnapshot) {
        return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
            && ApHelper.isOrganisation(routeSnapshot, this.applicationService)
            && this.applicationService.currentAccountablePerson.Role == "registering_for"
            && this.applicationService.currentAccountablePerson.ActingForSameAddress == "no";
    }
}
