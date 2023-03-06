import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService, SectionModel } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddAccountablePersonComponent } from "../add-accountable-person/add-accountable-person.component";
import { OrganisationNamedContactComponent } from "../organisation/named-contact/named-contact.component";

@Component({
    templateUrl: './accountable-for.component.html'
})
export class ApAccountableForComponent extends BaseComponent implements IHasNextPage, OnInit {
    static route: string = 'accountable-for';

    multi: boolean = false;
    anySelected = false;
    errorMessage?: string;
    constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
        super(router, applicationService, navigationService, activatedRoute);
    }

    ngOnInit(): void {
        this.multi = this.applicationService.model.NumberOfSections != 'one';
        this.errorMessage = `Select what ${this.getApName()} is accountable for`;

        if (!this.applicationService.currentAccountablePerson.SectionsAccountability) {
            this.applicationService.currentAccountablePerson.SectionsAccountability = [];
        }

        for(let i = 0; i < this.applicationService.model.Sections.length; i++) {
            if (!this.applicationService.currentAccountablePerson.SectionsAccountability[i]) {
                this.applicationService.currentAccountablePerson.SectionsAccountability[i] = [];
            }
        }
    }

    canContinue(): boolean {
        this.anySelected = true;
        for(let i = 0; i < this.applicationService.model.Sections.length; i++) {
            var sectionAccountability = this.applicationService.currentAccountablePerson.SectionsAccountability![i];
            this.anySelected = this.anySelected && sectionAccountability.length > 0;
        }

        return this.anySelected;
    }

    getTitle() {
        return this.multi ? 
            `Which areas of ${this.applicationService.model.BuildingName} is ${this.getApName()} accountable for?` : 
            `What is ${this.getApName()} accountable for?`
    }

    getApName() {
        return this.applicationService.currentAccountablePerson.Type == 'organisation' ?
            this.applicationService.currentAccountablePerson.OrganisationName :
            `${this.applicationService.currentAccountablePerson.FirstName} ${this.applicationService.currentAccountablePerson.LastName}`;
    }

    getSectionError(sectionIndex: number) {
        var sectionAccountability = this.applicationService.currentAccountablePerson.SectionsAccountability![sectionIndex];
        if (!sectionAccountability || sectionAccountability.length == 0) {
            return this.getErrorDescription(true, this.errorMessage!);
        }
        
        return this.getErrorDescription(false, '');
    }

    navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
        if (this.applicationService.currentAccountablePerson.Type == 'individual') {
            return navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, activatedRoute);
        }

        return navigationService.navigateRelative(OrganisationNamedContactComponent.route, activatedRoute);
    }
}