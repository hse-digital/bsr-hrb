import { Component, OnInit } from "@angular/core";
import { ApplicationService } from "src/app/services/application.service";

@Component({
    template: `<ap-address [pap]=true [addressName]="getPapAddressName()" />`
})
export class PapAddressComponent {
    static route: string = 'pap-address';

    constructor(private applicationService: ApplicationService) { }

    getPapAddressName() {
        if (this.applicationService.currentAccountablePerson.Type == 'organisation') {
            return `${this.applicationService.currentAccountablePerson.OrganisationName}'s address`;
        }

        return `${this.applicationService.currentAccountablePerson.FirstName} ${this.applicationService.currentAccountablePerson.LastName}'s address`;
    }
}