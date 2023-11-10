import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, ChangeSection, OutOfScopeReason, SectionModel, Status } from 'src/app/services/application.service';
import { RemoveStructureComponent } from '../remove-structure/remove-structure.component';
import { ChangeTaskListComponent } from '../../change-task-list/change-task-list.component';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';
import { SectionNameComponent } from 'src/app/features/application/building-summary/name/name.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-building-change-check-answers',
  templateUrl: './building-change-check-answers.component.html',
  styleUrls: ['./building-change-check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuildingChangeCheckAnswersComponent extends PageComponent<void> {
  static route: string = 'building-change-check-answers';
  static title: string = "Check your answers about the building summary - Register a high-rise building - GOV.UK";

  activeSections: SectionModel[] = [];
  changeBuildingSummaryHelper?: ChangeBuildingSummaryHelper;
  sectionNames: string[] = [];
  canChangeNumberOfSections: boolean = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  private initStatecode() {
    this.applicationService.model.Sections.filter(x => x.Statecode != "1").map(x => x.Statecode = "0");
  }

  private initChangeBuildingSummary() {
    if (!this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary = {
        Status: Status.NoChanges,
        Sections: this.applicationService.model.Sections.map(x => ({ Status: Status.NoChanges, SectionModel: CloneHelper.DeepCopy(x) } as ChangeSection))
      }
    }
  }

  private initChangeSectionModel(index: number) {
    if (!this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections)
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections = this.applicationService.model.Sections.map(x => ({ Status: Status.NoChanges, SectionModel: x } as ChangeSection));

    if (!this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections.at(index)) {
      let currentSection = this.applicationService.model.Sections.length > index ? this.applicationService.model.Sections[index] : new SectionModel();
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections[index] = {
        Status: Status.NoChanges,
        SectionModel: CloneHelper.DeepCopy(currentSection)
      }
    }
  }

  private getActiveSections() {
    return this.applicationService.model.Sections.filter(x => x.Statecode != "1");
  }

  hasIncompleteData = false;

  private isSectionOutOfScopeBecause(section: SectionModel, OutOfScopeReason: OutOfScopeReason) {
    return section.Scope?.OutOfScopeReason == +OutOfScopeReason;
  }

  navigateToMultipleSections() {
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute);
  }

  getSectionName(index: number) {
    return `${this.sectionNames[index]} high-rise residential structure`;
  }

  override onInit(applicationService: ApplicationService): void {
    this.initStatecode();
    this.initChangeBuildingSummary();
    this.changeBuildingSummaryHelper = new ChangeBuildingSummaryHelper(this.applicationService);
    this.activeSections = this.changeBuildingSummaryHelper.getSections();
    this.updateBuildingChangeStatus();

    this.sectionNames = this.generateSectionNames();
    this.canChangeNumberOfSections = this.applicationService.model.Sections.filter((x, index) => !this.isSectionRemoved(index)).length == 1;
  }

  private generateSectionNames() {
    let sectionCardinalNameIndex = 0;
    return this.activeSections.map((x, i) => {
      let index = this.isSectionRemoved(i) ? -1 : sectionCardinalNameIndex;
      if (!this.isSectionRemoved(i)) sectionCardinalNameIndex++;

      return index != -1 ? SectionHelper.getSectionCardinalName(index) : "";
    });
  }

  private updateBuildingChangeStatus() {
    if (this.changeBuildingSummaryHelper?.hasBuildingChange()) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Status = this.validateModel()
        ? Status.ChangesComplete
        : Status.ChangesInProgress;
    } else {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Status = Status.NoChanges;
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    var canContinue = this.validateModel();
    this.hasIncompleteData = !canContinue;
    return canContinue;
  }

  private validateModel() {
    let canContinue = true;
    let sections = this.activeSections.filter((x, index) => !this.isSectionRemoved(index));
    for (var section of sections) {
      if (this.applicationService.model.NumberOfSections == "two_or_more") {
        canContinue &&= FieldValidations.IsNotNullOrWhitespace(section.Name);
      }

      canContinue &&= FieldValidations.IsGreaterThanZero(section.FloorsAbove);
      canContinue &&= FieldValidations.IsGreaterThanZero(section.Height);
      if (!this.isSectionOutOfScopeBecause(section, OutOfScopeReason.Height)) {

        canContinue &&= FieldValidations.IsAPositiveNumber(section.ResidentialUnits);

        if (!this.isSectionOutOfScopeBecause(section, OutOfScopeReason.NumberResidentialUnits)) {

          canContinue &&= (section.YearOfCompletionOption == "not-completed") || (section.YearOfCompletionOption == "year-exact" && FieldValidations.IsNotNullOrWhitespace(section.YearOfCompletion)) || (section.YearOfCompletionOption == "year-not-exact" && FieldValidations.IsNotNullOrWhitespace(section.YearOfCompletionRange));
          canContinue &&= section.Addresses?.length > 0;

          if ((section.YearOfCompletionOption == 'year-exact' && Number(section.YearOfCompletion) >= 2023) || (section.YearOfCompletionOption == 'year-not-exact' && section.YearOfCompletionRange == '2023-onwards')) {
            canContinue &&= FieldValidations.IsNotNullOrWhitespace(section.CompletionCertificateIssuer);
            canContinue &&= FieldValidations.IsNotNullOrWhitespace(section.CompletionCertificateReference);
          }

        }
      }
    }
    return canContinue;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ChangeTaskListComponent.route, this.activatedRoute);
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStage.BlocksInBuildingComplete;
    await this.applicationService.syncBuildingStructures();

    this.applicationService.model.Sections = this.getActiveSections();
  }

  private getOutOfScopeSections() {
    return this.applicationService.model.Sections.filter(section => SectionHelper.isOutOfScope(section));
  }

  removeStructure(index: number) {
    this.initChangeSectionModel(index);
    return this.navigationService.navigateRelative(RemoveStructureComponent.route, this.activatedRoute, {
      index: index
    });
  }

  async addAnotherStructure() {
    let section = this.applicationService.startNewSection();
    this.initChangeSectionModel(this.applicationService._currentSectionIndex);
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentChange = SectionNameComponent.route;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentSectionIndex = this.applicationService._currentSectionIndex;
    await this.applicationService.updateApplication();
    return this.navigationService.navigateRelative(`../sections/${section}/${SectionNameComponent.route}`, this.activatedRoute);
  }

  isSectionRemoved(index: number) {
    return (this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[index]?.Status ?? Status.NoChanges) == Status.Removed;
  }

}
