import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountablePersonModel } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: 'organisation-answers',
    templateUrl: './organisation-answers.component.html'
})
export class OrganisationAnswersComponent {

    constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) { }

    @Input() ap!: AccountablePersonModel;
    @Input() apIndex!: number;
    @Input() hasMoreAp = false;

    navigateTo(url: string, query?: string) {
        this.navigationService.navigateRelative(`accountable-person-${this.apIndex + 1}/${url}`, this.activatedRoute, {
            return: 'check-answers'
        });
    }

    notPap() {
        return this.ap.IsPrincipal == 'no';
    }

    notLead() {
        return this.ap.Role == 'registering_for';
    }

    individual() {
        return this.ap.Type == 'individual';
    }

    organisation() {
        return this.ap.Type == 'organisation';
    }

    whoAreYouDescription() {
        switch(this.ap.Role) {
            case 'named_contact': return 'I am the named contact';
            case 'registering_for': return 'I am registering for the named contact';
        }

        return undefined;
    }

    useSameAddressDescription() {
        return this.ap.ActingForSameAddress == 'yes' ? 'Yes, use the same address' : 'No, use a different address';
    }

    organisationTypeDescription() {
        switch(this.ap.OrganisationType) {
            case 'commonhold-association': return 'Commonhold association';
            case 'housing-association': return 'Housing association or other company operating under section 27 of the Housing Act 1985';
            case 'local-authority': return 'Local authority';
            case 'management-company': return 'Management company';
            case 'rmc-or-organisation': return 'Resident management company (RMC) or organisation';
            case 'rtm-or-organisation': return 'Right to manage (RTM) company or organisation';
        }
        return this.ap.OrganisationTypeDescription;
    }

    leadJobRoleDescription() {
        switch(this.ap.LeadJobRole) {
            case 'director': return 'Director';
            case 'administrative_worker': return 'Administrative or office worker';
            case 'building_manager': return 'Building or facilities manager';
            case 'building_director': return 'Building safety director';
        }

        return 'Other';
    }

    areasOfAccountability() {
        var values = new Set(this.ap.SectionsAccountability?.reduce((array, current) => {
            array.push(...current);
            return array;
        }, []));
        
        return [...values].map(x => this._accountabilityDescription(x)).join(', ');
    }

    private _accountabilityDescription(value: string) {
        switch (value) {
            case 'external_walls': return 'External walls and roof';
            case 'routes': return 'Routes that residents can walk through';
            case 'maintenance': return 'Maintaining plant and equipment';
        }

        return 'Facilities that residents share';
    }
}