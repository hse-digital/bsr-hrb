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

    addMore() {
        this.navigationService.navigateRelative('add-more', this.activatedRoute);
    }

    goToApType() {
        if (this.apIndex == 0) {
            this.navigationService.navigateRelative('', this.activatedRoute);
        } else {
            this.navigateTo('accountable-person-type');
        }
    }

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

    whoAreYouDescription() {
        switch (this.ap.Role) {
            case 'named_contact': return 'I am the named contact';
            case 'registering_for': return 'I am registering for the named contact';
        }

        return undefined;
    }

    useSameAddressDescription() {
        switch(this.ap.ActingForSameAddress) {
            case 'yes': return 'Yes, use the same address';
            case 'no': return 'No, use a different address';
        }
        
        return undefined;
    }

    organisationTypeDescription() {
        switch (this.ap.OrganisationType) {
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
        switch (this.ap.LeadJobRole) {
            case 'director': return 'Director';
            case 'administrative_worker': return 'Administrative or office worker';
            case 'building_manager': return 'Building or facilities manager';
            case 'building_director': return 'Building safety director';
            case 'other': return 'Other';
        }

        return undefined;
    }

    sectionsWithAccountability() {
        return this.ap.SectionsAccountability?.filter(x => x.Accountability?.length ?? 0 > 0);
    }

    _accountabilityDescription(value: string) {
        switch (value) {
            case 'external_walls': return 'External walls and roof';
            case 'routes': return 'Routes that residents can walk through';
            case 'maintenance': return 'Maintaining plant and equipment';
        }

        return 'Facilities that residents share';
    }

    apAddress() {
        return this.ap.PapAddress ?? this.ap.Address;
    }
}