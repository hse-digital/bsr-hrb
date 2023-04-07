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
            address: addressIndex + 1
        });
    }

    showCompletionCertificate() {
        return (this.section.YearOfCompletionOption == 'year-exact' && Number(this.section.YearOfCompletion) >= 1985) ||
            (this.section.YearOfCompletionOption == 'year-not-exact' && ['1985-to-2000', '2001-to-2006', '2007-to-2018', '2019-to-2022', '2023-onwards'].indexOf(this.section.YearOfCompletionRange!) > -1);
    }
}