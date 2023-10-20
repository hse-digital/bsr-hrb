import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, ChangeSection, Status } from 'src/app/services/application.service';
import { BuildingChangeCheckAnswersComponent } from '../building-change-check-answers/building-change-check-answers.component';

@Component({
  selector: 'hse-remove-structure',
  templateUrl: './remove-structure.component.html'
})
export class RemoveStructureComponent extends PageComponent<string> {
  static route: string = 'remove-structure';
  static title: string = "Confirm you want to remove this structure - Register a high-rise building - GOV.UK";

  index?: number;
  changedSection?: ChangeSection;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.activatedRoute.queryParams.subscribe(params => {
      this.index = params['index'];
    });
    this.model = this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[this.index ?? 0].RemoveStructureAreYouSure;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections[this.index ?? 0].RemoveStructureAreYouSure = this.model;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections[this.index ?? 0].Status = this.model == 'yes' ? Status.Removed : Status.NoChanges;
    if (this.model == 'yes' && this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections.filter(x => x.Status != Status.Removed).length == 1) this.changeNumberOfSectionsToOne()
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[this.index ?? 0];
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if(this.model == 'yes') {
      return this.navigationService.navigateRelative(RemoveStructureComponent.route, this.activatedRoute);
    }    
    return this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
  }

  isKbiComplete() {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
  }

  private changeNumberOfSectionsToOne() {
    this.applicationService.model.NumberOfSections = 'one';
    this.applicationService.updateApplication();
  }

  get errorMessage() {
    return `Select 'yes' if you want to remove ${this.applicationService.currentSection.Name} from this application`;
  }

}
