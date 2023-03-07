import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SectionModel } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: 'section-answers',
    templateUrl: './section-answers.component.html'
})
export class SectionAnswersComponent {

    constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) { }

    @Input() section!: SectionModel;
    @Input() sectionIndex!: number;
    @Input() hasMoreSections = false;

    navigateTo(url: string, query?: string) {
        this.navigationService.navigateRelative(`section-${this.sectionIndex + 1}/${url}`, this.activatedRoute, {
            return: 'check-answers'
        });
    }

    navigateToAddress(url: string, addressIndex: number) {
        this.navigationService.navigateRelative(`section-${this.sectionIndex + 1}/${url}`, this.activatedRoute, {
            return: 'check-answers',
            address: addressIndex+1
        });
    }
}