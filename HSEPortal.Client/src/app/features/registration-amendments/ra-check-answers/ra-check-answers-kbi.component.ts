import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApplicationService, KbiSectionModel } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { RegistrationAmendmentsService } from "src/app/services/registration-amendments.service";
import { ChangeKbiHelper } from "src/app/helpers/registration-amendments/change-kbi-helper";
import { KbiChangeCheckAnswersModule } from "../change-kbi/check-answers-building-information/kbi.check-answers-building-information.module";
import { ChangeBuildingInformationCheckAnswersComponent } from "../change-kbi/check-answers-building-information/check-answers-building-information.component";

@Component({
    selector: 'ra-check-answers-kbi',
    templateUrl: './ra-check-answers-kbi.component.html'
})
export class RaCheckAnswersKbiComponent {
    
    private changeKbiHelper = new ChangeKbiHelper(this.applicationService);

    constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, protected applicationService: ApplicationService, private registrationAmendmentsService: RegistrationAmendmentsService) {
    }

    get kbiSections(): KbiSectionModel[] {
        return this.applicationService.currentVersion.Kbi?.KbiSections ?? [];
    }

    kbiSectionChanges(kbiSection: KbiSectionModel, index: number) {
        return this.changeKbiHelper.getChangesOf(kbiSection, index) ?? [];
    }

    navigateToCheckAnswersPage(index: number) {
        this.navigationService.navigateRelative(`${KbiChangeCheckAnswersModule.baseRoute}/${ChangeBuildingInformationCheckAnswersComponent.route}`, this.activatedRoute, {
            index: index
        });
    }

    navigateTo(url: string, kbiIndex: number) {
        this.applicationService.updateApplication();
        this.navigationService.navigateRelative(`../kbi/${kbiIndex + 1}/${url}`, this.activatedRoute);
    }

    navigateToAddress(url: string, kbiIndex: number, addressIndex: number) {
        this.applicationService.updateApplication();
        this.navigationService.navigateRelative(`../kbi/${kbiIndex + 1}/${url}`, this.activatedRoute, {
            address: addressIndex + 1
        });
    }

    isArray(variable?: any): any {
        return !!variable && variable instanceof Array;
    }
}

