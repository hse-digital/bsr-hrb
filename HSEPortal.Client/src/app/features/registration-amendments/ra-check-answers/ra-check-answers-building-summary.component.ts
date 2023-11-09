import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuildingSummaryChangeModel, ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { RegistrationAmendmentsService } from 'src/app/services/registration-amendments.service';
import { BuildingChangeCheckAnswersComponent } from '../change-building-summary/building-change-check-answers/building-change-check-answers.component';

@Component({
  selector: 'ra-check-answers-building-summary',
  templateUrl: './ra-check-answers-building-summary.component.html'
})
export class RaCheckAnswersBuildingSummaryComponent {
  
  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, protected applicationService: ApplicationService, private registrationAmendmentsService: RegistrationAmendmentsService) { 
    this._changes = new ChangeBuildingSummaryHelper(this.applicationService).getOnlyChanges();
  }

  private _changes: BuildingSummaryChangeModel[];
  get changes(): BuildingSummaryChangeModel[] {
    return this._changes;
  }

  get OldStructures(): string[] {
    let names = this.applicationService.model.Sections.map(x => x.Name!);
    if(names.length == 0 || names.every(x => x == null || x == undefined)) return [this.applicationService.model.BuildingName!];
    return names;
  }

  get NewStructures(): string[] {
    return new ChangeBuildingSummaryHelper(this.applicationService).getSectionNames();
  }

  navigateToBuildingCheckAnswersPage() {
    this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
  }

  navigateTo(url: string, sectionIndex: number) {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentChange = url;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentSectionIndex = sectionIndex;
    this.applicationService.updateApplication();
    this.navigationService.navigateRelative(`../sections/section-${sectionIndex + 1}/${url}`, this.activatedRoute);
  }

  navigateToAddress(url: string, sectionIndex: number, addressIndex: number) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentChange = url;
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentSectionIndex = sectionIndex;
      this.applicationService.updateApplication();
      this.navigationService.navigateRelative(`../sections/section-${sectionIndex + 1}/${url}`, this.activatedRoute, {
          address: addressIndex + 1
      });
  }

  areStructuresDifferent() {
    return this.OldStructures.length != this.NewStructures.length || this.OldStructures.some((x, index) => x != this.NewStructures[index]);
  }
}
