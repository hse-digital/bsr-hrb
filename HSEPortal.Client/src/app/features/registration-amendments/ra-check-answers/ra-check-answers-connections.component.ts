import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { RegistrationAmendmentsService } from "src/app/services/registration-amendments.service";
import { ChangeConnectionsHelper } from "src/app/helpers/registration-amendments/change-connections-helper";
import { ChangeConnectionsComponent } from "../change-connections/change-connections/change-connections.component";

@Component({
    selector: 'ra-check-answers-connections',
    templateUrl: './ra-check-answers-connections.component.html'
})
export class RaCheckAnswersConnectionsComponent {
    
    private changeConnnectionsHelper = new ChangeConnectionsHelper(this.applicationService);
    changes: any[];
    
    constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, protected applicationService: ApplicationService, private registrationAmendmentsService: RegistrationAmendmentsService) {
        this.changes = this.changeConnnectionsHelper.getChanges() ?? [];
    }

    navigateToCheckAnswersPage(index: number) {
        this.navigationService.navigateRelative(`${ChangeConnectionsComponent.route}`, this.activatedRoute);
    }

    navigateTo(url: string) {
        this.navigationService.navigateRelative(`../kbi/${url}`, this.activatedRoute);
    }

    isArray(variable?: any): any {
        return !!variable && variable instanceof Array;
    }
}

