import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApplicationService, SectionModel } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: 'building-change-removed-section-answers',
    templateUrl: './building-change-removed-section-answers.component.html'
})
export class BuildingChangeRemovedSectionAnswersComponent implements OnInit {

    constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, private applicationService: ApplicationService) { }

    @Input() section!: SectionModel;
    @Input() sectionIndex!: number;

    ngOnInit(): void {

    }

    navigateTo(url: string) {
        this.navigationService.navigateRelative(url, this.activatedRoute, {
            index: this.sectionIndex
        });
    }

    get key() {
        return `Remove ${this.section.Name}`;
    }

    get reasonKey() {
        return `Why do you want to remove ${this.section.Name}?`;
    }

    get reason() {
        return this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[this.sectionIndex].WhyWantRemoveSection;
    }

}
