import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { RegistrationAmendmentsService } from 'src/app/services/registration-amendments.service';
import { BuildingChangeCheckAnswersComponent } from '../change-building-summary/building-change-check-answers/building-change-check-answers.component';
import { ChangedAnswersModel } from 'src/app/helpers/registration-amendments/change-helper';

@Component({
  selector: 'ra-check-answers-building-summary',
  templateUrl: './ra-check-answers-building-summary.component.html'
})
export class RaCheckAnswersBuildingSummaryComponent {

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, protected applicationService: ApplicationService, private registrationAmendmentsService: RegistrationAmendmentsService) { 
    this._changes = new ChangeBuildingSummaryHelper(this.applicationService).getChanges();
  }

  private _changes: ChangedAnswersModel[];
  get changes(): ChangedAnswersModel[] {
    return this._changes;
  }

  navigateToBuildingCheckAnswersPage() {
    this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
  }

  navigateTo(url: string, sectionIndex: number) {
    this.applicationService.updateApplication();
    this.navigationService.navigateRelative(`../sections/section-${sectionIndex + 1}/${url}`, this.activatedRoute);
  }

  navigateToAddress(url: string, sectionIndex: number, addressIndex: number) {
      this.applicationService.updateApplication();
      this.navigationService.navigateRelative(`../sections/section-${sectionIndex + 1}/${url}`, this.activatedRoute, {
          address: addressIndex + 1
      });
  }
  
  isArray(variable?: any): any {
    return !!variable && variable instanceof Array;
  }
  
}
