import { Component } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";

@Component({
    template: `<ap-address [pap]=true />`
})
export class PapAddressComponent implements CanActivate {
    static route: string = 'pap-address';

    static title: string = "Find the address of the PAP - Register a high-rise building - GOV.UK";
    static selectTitle: string = "Select the PAP's address - Register a high-rise building - GOV.UK";
    static confirmTitle: string = "Confirm the PAP's address - Register a high-rise building - GOV.UK";

    constructor(private applicationService: ApplicationService) { }

    canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
        return (!!this.applicationService.currentAccountablePerson.IsPrincipal && this.applicationService.currentAccountablePerson.IsPrincipal == 'yes')
            || !!this.applicationService.currentAccountablePerson.OrganisationName
            || (!!this.applicationService.currentAccountablePerson.Email && !!this.applicationService.currentAccountablePerson.PhoneNumber);
    }
}
