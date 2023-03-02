import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddAccountablePersonComponent } from "../add-accountable-person/add-accountable-person.component";
import { PapWhoAreYouComponent } from "../organisation/pap-who-are-you/pap-who-are-you.component";


@Component({
    templateUrl: './pap-address.component.html'
})
export class PapAddressComponent {
    static route: string = 'pap-address';
    searchMode = AddressSearchMode.PostalAddress;

    constructor(private router: Router, private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
    }

    getPapName() {
        var currentAccountablePerson = this.applicationService.currentAccountablePerson;
        if (this.applicationService.model.PrincipalAccountableType == 'individual') {
            return `Address of ${currentAccountablePerson.FirstName} ${currentAccountablePerson.LastName}`;
        }

        return `Address of ${currentAccountablePerson.OrganisationName}`;
    }

    async updateAddress(address: AddressModel) {
        this.applicationService.currentAccountablePerson.PapAddress = address;
        await this.applicationService.updateApplication();

        if (this.applicationService.model.PrincipalAccountableType == 'individual') {
            this.navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, this.activatedRoute);
        } else {
            this.navigationService.navigateRelative(PapWhoAreYouComponent.route, this.activatedRoute);
        }
    }
}