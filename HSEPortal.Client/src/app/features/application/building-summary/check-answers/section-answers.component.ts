import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApplicationService, OutOfScopeReason, SectionModel } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddMoreSectionsComponent } from "../add-more-sections/add-more-sections.component";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";

@Component({
    selector: 'section-answers',
    templateUrl: './section-answers.component.html'
})
export class SectionAnswersComponent implements OnInit {

    constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, private applicationService: ApplicationService) { }

    @Input() section!: SectionModel;
    @Input() sectionIndex!: number;
    @Input() hasMoreSections = false;

    isInScope: boolean = true;

    ngOnInit(): void {
        this.isInScope = !this.section.Scope?.IsOutOfScope;
    }

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

    showName() {
        return this.applicationService.model.NumberOfSections == 'two_or_more';
    }

    addMoreSections() {
        this.navigationService.navigateRelative(`${AddMoreSectionsComponent.route}`, this.activatedRoute);
    }

    showCompletionCertificate() {
        return (this.section.YearOfCompletionOption == 'year-exact' && Number(this.section.YearOfCompletion) >= 1985) ||
            (this.section.YearOfCompletionOption == 'year-not-exact' && ['1985-to-2000', '2001-to-2006', '2007-to-2018', '2019-to-2022', '2023-onwards'].indexOf(this.section.YearOfCompletionRange!) > -1);
    }

    showResidentialUnits() {
        return this.isInScope || this.section.Scope?.OutOfScopeReason != OutOfScopeReason.Height;
    }

    showPeopleLivingBuilding() {
        return this.isInScope || this.section.Scope?.OutOfScopeReason == OutOfScopeReason.PeopleLivingInBuilding;
    }

    isNotNullOrWhitespace(value?: string) {
        return FieldValidations.IsNotNullOrWhitespace(value);
    }

}