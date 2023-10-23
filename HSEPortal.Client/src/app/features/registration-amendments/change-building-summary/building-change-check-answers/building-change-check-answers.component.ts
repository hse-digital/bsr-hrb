import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AccountablePersonModule } from 'src/app/features/application/accountable-person/accountable-person.module';
import { AccountablePersonComponent } from 'src/app/features/application/accountable-person/accountable-person/accountable-person.component';
import { MoreInformationComponent } from 'src/app/features/application/building-summary/more-information/more-information.component';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';
import { BuildingOutOfScopeComponent } from 'src/app/features/application/out-of-scope/out-of-scope.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { ScopeAndDuplicateHelper } from 'src/app/helpers/scope-duplicate-helper';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { AddressModel } from 'src/app/services/address.service';
import { ApplicationService, BuildingApplicationStage, ChangeBuildingSummary, ChangeSection, OutOfScopeReason, SectionModel, Status } from 'src/app/services/application.service';
import { RemoveStructureComponent } from '../remove-structure/remove-structure.component';
import { ChangeTaskListComponent } from '../../change-task-list/change-task-list.component';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';

@Component({
  selector: 'hse-building-change-check-answers',
  templateUrl: './building-change-check-answers.component.html',
  styleUrls: ['./building-change-check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuildingChangeCheckAnswersComponent  extends PageComponent<void> {
  static route: string = 'building-change-check-answers';
  static title: string = "Check your answers about the building summary - Register a high-rise building - GOV.UK";

  activeSections: SectionModel[] = [];
  changeBuildingSummaryHelper?: ChangeBuildingSummaryHelper;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  private initStatecode() {
    this.applicationService.model.Sections.filter(x => x.Statecode != "1").map(x => x.Statecode = "0");
  }

  private initChangeBuildingSummary() {
    if(!this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary = {
        Status: Status.NoChanges,
        Sections: Array<ChangeSection>(this.applicationService.model.Sections.length)
      }
    }
  }

  private initChangeSectionModel(index: number) {
    if(!this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections.at(index)) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections[index] = {
        Status: Status.NoChanges,
        SectionModel: new SectionModel()
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
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { return: 'sections/check-answers' });
  }

  getSectionName(sectionIndex: number, section?: SectionModel) {
    return section?.Name ?? `${SectionHelper.getSectionCardinalName(sectionIndex)} high-rise residential structure`;
  }

  override onInit(applicationService: ApplicationService): void {
    this.initStatecode();
    this.initChangeBuildingSummary();
    this.changeBuildingSummaryHelper = new ChangeBuildingSummaryHelper(this.applicationService);
    this.activeSections = this.changeBuildingSummaryHelper.getSections();
    this.updateBuildingChangeStatus();
  }

  private updateBuildingChangeStatus() {
    if(this.changeBuildingSummaryHelper?.hasBuildingChange()) {
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
    for (var section of this.activeSections) {
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
    if (ScopeAndDuplicateHelper.AreAllSectionsOutOfScope(this.applicationService)) {
      return this.navigationService.navigateRelative(`../${BuildingOutOfScopeComponent.route}`, this.activatedRoute);
    }

    var sectionsOutOfScope = this.getOutOfScopeSections();
    if (sectionsOutOfScope.length > 0) {
      return this.navigationService.navigateRelative(MoreInformationComponent.route, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(ChangeTaskListComponent.route, this.activatedRoute);
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
    this.initChangeSectionModel(index);
    return this.navigationService.navigateRelative(RemoveStructureComponent.route, this.activatedRoute, {
      index: index
    });
  }

  addAnotherStructure() {

  }

  isSectionRemoved(index: number) {
    return (this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[index]?.Status ?? Status.NoChanges) == Status.Removed;
  }

}
