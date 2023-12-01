import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChangedAnswersModel } from "src/app/helpers/registration-amendments/change-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { RegistrationAmendmentsService } from "src/app/services/registration-amendments.service";
import { BuildingChangeCheckAnswersComponent } from "../change-building-summary/building-change-check-answers/building-change-check-answers.component";
import { ChangeAccountablePersonsHelper } from "src/app/helpers/registration-amendments/change-accountable-persons-helper";

@Component({
    selector: 'ra-check-answers-accountable-persons',
    templateUrl: './ra-check-answers-accountable-persons.component.html'
})
export class RaCheckAnswersAccountablePersonsComponent {

    constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, protected applicationService: ApplicationService, private registrationAmendmentsService: RegistrationAmendmentsService) {
        let helper = new ChangeAccountablePersonsHelper(this.applicationService);
        this._changes = helper.getPAPChanges();
        this._changesAccountability = helper.getAreasAccountabilityChanges();
    }

    private _changes: ChangedAnswersModel[];
    get changes(): ChangedAnswersModel[] {
        return this._changes;
    }

    private _changesAccountability: ChangedAnswersModel[];
    get changesAccountability(): ChangedAnswersModel[] {
        return this._changesAccountability;
    }

    navigateToBuildingCheckAnswersPage() {
        this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
    }

    navigateTo(url: string) {
        this.applicationService.updateApplication();
        this.navigationService.navigateRelative(``, this.activatedRoute);
    }

    navigateToAddress(url: string, sectionIndex: number, addressIndex: number) {
        this.applicationService.updateApplication();
        this.navigationService.navigateRelative(``, this.activatedRoute, {
            address: addressIndex + 1
        });
    }

    isArray(variable?: any): any {
        return !!variable && variable instanceof Array;
    }

}