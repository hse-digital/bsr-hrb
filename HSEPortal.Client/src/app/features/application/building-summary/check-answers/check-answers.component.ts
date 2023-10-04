import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, OutOfScopeReason, SectionModel } from 'src/app/services/application.service';
import { AccountablePersonModule } from '../../accountable-person/accountable-person.module';
import { AccountablePersonComponent } from '../../accountable-person/accountable-person/accountable-person.component';
import { NumberOfSectionsComponment } from '../number-of-sections/number-of-sections.component';
import { MoreInformationComponent } from '../more-information/more-information.component';
import { BuildingOutOfScopeComponent } from '../../out-of-scope/out-of-scope.component';
import { ScopeAndDuplicateHelper } from 'src/app/helpers/scope-duplicate-helper';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-check-answers',
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionCheckAnswersComponent extends PageComponent<void> {
  static route: string = 'check-answers';
  static title: string = "Check your answers - Register a high-rise building - GOV.UK";

  activeSections: SectionModel[] = [];

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  private initStatecode() {
    this.applicationService.model.Sections.filter(x => x.Statecode != "1").map(x => x.Statecode = "0");
  }

  private getActiveSections() {
    return this.applicationService.model.Sections.filter(x => x.Statecode != "1");
  }

  hasIncompleteData = false;

  private isSectionOutOfScopeBecause(section: SectionModel, OutOfScopeReason: OutOfScopeReason) {
    return section.Scope?.OutOfScopeReason == +OutOfScopeReason;
  }

  navigateToMultipleSections() {
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { return: 'sections/check-answers' });
  }

  getSectionName(sectionIndex: number, section?: SectionModel) {
    return section?.Name ?? `${SectionHelper.getSectionCardinalName(sectionIndex)} high-rise residential structure`;
  }

  override onInit(applicationService: ApplicationService): void {
    this.initStatecode();
    this.activeSections = this.getActiveSections();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.BlocksInBuildingInProgress) == BuildingApplicationStage.BlocksInBuildingInProgress;
  }

  override isValid(): boolean {
    var canContinue = true;
    for (var section of this.activeSections) {
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

  override navigateNext(): Promise<boolean> {
    if (ScopeAndDuplicateHelper.AreAllSectionsOutOfScope(this.applicationService)) {
      return this.navigationService.navigateRelative(`../${BuildingOutOfScopeComponent.route}`, this.activatedRoute);
    }

    var sectionsOutOfScope = this.getOutOfScopeSections();
    if (sectionsOutOfScope.length > 0) {
      return this.navigationService.navigateRelative(MoreInformationComponent.route, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(`../${AccountablePersonModule.baseRoute}/${AccountablePersonComponent.route}`, this.activatedRoute);
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStage.BlocksInBuildingComplete;
    await this.applicationService.syncBuildingStructures();

    this.applicationService.model.Sections =  this.getActiveSections();
  }

  private getOutOfScopeSections() {
    return this.applicationService.model.Sections.filter(section => SectionHelper.isOutOfScope(section));
  }

  removeStructure(index: number) {
    this.applicationService.removeStructure(index);
    if (this.applicationService.model.Sections.filter(x => x.Statecode != "1").length == 1) {
      this.changeNumberOfSectionsToOne();
    }
    this.activeSections = this.getActiveSections();
  }

  private changeNumberOfSectionsToOne() {
    this.applicationService.model.NumberOfSections = 'one';
    this.applicationService.updateApplication();
  }
}
