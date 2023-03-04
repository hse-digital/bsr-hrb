import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddAccountablePersonComponent } from "../add-accountable-person/add-accountable-person.component";
import { PapNameComponent } from "../ap-name/pap-name.component";
import { PapWhoAreYouComponent } from "../organisation/pap-who-are-you/pap-who-are-you.component";

@Component({
    selector: 'ap-address',
    templateUrl: './ap-address.component.html'
})
export class ApAddressComponent implements OnInit {
    static route: string = 'address';
    searchMode = AddressSearchMode.PostalAddress;

    @Input() pap: boolean = false;
    @Input() addressName?: string;
    address?: AddressModel;

    constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.address = this.pap ? this.applicationService.currentAccountablePerson.PapAddress : this.applicationService.currentAccountablePerson.Address;
    }

    getApName() {
        if (this.addressName) return this.addressName;

        if (this.applicationService._currentAccountablePersonIndex == 0) {
            return "Your address";
        }

        var currentAccountablePerson = this.applicationService.currentAccountablePerson;
        if (this.applicationService.model.PrincipalAccountableType == 'individual') {
            return `Address of ${currentAccountablePerson.FirstName} ${currentAccountablePerson.LastName}`;
        }

        return `Address of ${currentAccountablePerson.OrganisationName}`;
    }

    async updateAddress(address: AddressModel) {
        if (this.pap) {
            this.applicationService.currentAccountablePerson.PapAddress = address;
        } else {
            this.applicationService.currentAccountablePerson.Address = address;
        }

        if (this.pap) {
            if (this.applicationService.currentAccountablePerson.Type == 'organisation') {
                this.navigationService.navigateRelative(PapWhoAreYouComponent.route, this.activatedRoute);
            } else {
                this.navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, this.activatedRoute);
            }
        } else {
            this.navigationService.navigateRelative(PapNameComponent.route, this.activatedRoute);
        }
    }
}