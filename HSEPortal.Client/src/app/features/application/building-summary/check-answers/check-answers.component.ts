import { Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStatus, OutOfScopeReason, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { AccountablePersonModule } from '../../accountable-person/accountable-person.module';
import { AccountablePersonComponent } from '../../accountable-person/accountable-person/accountable-person.component';
import { NumberOfSectionsComponment } from '../number-of-sections/number-of-sections.component';
import { MoreInformationComponent } from '../more-information/more-information.component';
import { BuildingOutOfScopeComponent } from '../../out-of-scope/out-of-scope.component';
import { ScopeAndDuplicateHelper } from 'src/app/helpers/scope-duplicate-helper';

@Component({
  selector: 'hse-check-answers',
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers';
  static title: string = "Check your answers - Register a high-rise building - GOV.UK";

  sections: SectionModel[] = [];

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  async ngOnInit() {
    this.sections = this.applicationService.model.Sections;
  }

  hasIncompleteData = false;
  canContinue(): boolean {
    var canContinue = true;
    for (var section of this.sections) {
      if (this.applicationService.model.NumberOfSections == "two_or_more") {
        canContinue &&= FieldValidations.IsNotNullOrWhitespace(section.Name);
      }

      canContinue &&= FieldValidations.IsGreaterThanZero(section.FloorsAbove);
      canContinue &&= FieldValidations.IsGreaterThanZero(section.Height);
      if (!this.isSectionOutOfScopeBecause(section, OutOfScopeReason.Height)) {

        canContinue &&= FieldValidations.IsAPositiveNumber(section.ResidentialUnits);

        if (!this.isSectionOutOfScopeBecause(section, OutOfScopeReason.NumberResidentialUnits)) {

          if (section.YearOfCompletionOption != 'not-completed') {
            canContinue &&= FieldValidations.IsNotNullOrWhitespace(section.PeopleLivingInBuilding);
          }

          if (!this.isSectionOutOfScopeBecause(section, OutOfScopeReason.PeopleLivingInBuilding)) {

            canContinue &&= (section.YearOfCompletionOption == "not-completed") || (section.YearOfCompletionOption == "year-exact" && FieldValidations.IsNotNullOrWhitespace(section.YearOfCompletion)) || (section.YearOfCompletionOption == "year-not-exact" && FieldValidations.IsNotNullOrWhitespace(section.YearOfCompletionRange));
            canContinue &&= section.Addresses?.length > 0;

            if ((section.YearOfCompletionOption == 'year-exact' && Number(section.YearOfCompletion) >= 2023) || (section.YearOfCompletionOption == 'year-not-exact' && section.YearOfCompletionRange == '2023-onwards')) {
              canContinue &&= FieldValidations.IsNotNullOrWhitespace(section.CompletionCertificateIssuer);
              canContinue &&= FieldValidations.IsNotNullOrWhitespace(section.CompletionCertificateReference);
            }
          }
        }
      }
    }

    this.hasIncompleteData = !canContinue;
    return canContinue;
  }

  private isSectionOutOfScopeBecause(section: SectionModel, OutOfScopeReason: OutOfScopeReason) {
    return section.Scope?.OutOfScopeReason == +OutOfScopeReason;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (ScopeAndDuplicateHelper.AreAllSectionsOutOfScope(this.applicationService)) {
      return navigationService.navigateRelative(`../${BuildingOutOfScopeComponent.route}`, activatedRoute);
    }

    var sectionsOutOfScope = this.getOutOfScopeSections();
    if (sectionsOutOfScope.length > 0) {
      return navigationService.navigateRelative(MoreInformationComponent.route, activatedRoute);
    }

    return navigationService.navigateRelative(`../${AccountablePersonModule.baseRoute}/${AccountablePersonComponent.route}`, activatedRoute);
  }

  navigateToMultipleSections() {
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { return: 'sections/check-answers' });
  }

  getSectionName(sectionIndex: number, section?: SectionModel) {
    return section?.Name ?? `${SectionHelper.getSectionCardinalName(sectionIndex)} high-rise residential structure`;
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.BlocksInBuildingComplete;

    await this.applicationService.syncBuildingStructures();
  }

  private getOutOfScopeSections() {
    return this.applicationService.model.Sections.filter(section => SectionHelper.isOutOfScope(section));
  }

  override canAccess(_: ActivatedRouteSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.BlocksInBuildingInProgress) == BuildingApplicationStatus.BlocksInBuildingInProgress;
  }
}
