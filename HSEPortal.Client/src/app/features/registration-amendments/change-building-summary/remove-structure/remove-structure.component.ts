import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, ChangeSection, Status } from 'src/app/services/application.service';
import { BuildingChangeCheckAnswersComponent } from '../building-change-check-answers/building-change-check-answers.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { WhyRemoveComponent } from '../why-remove/why-remove.component';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';

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
      if(!this.index) this.navigationService.navigateRelative(NotFoundComponent.route, this.activatedRoute);
      this.model = this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[this.index ?? 0].RemoveStructureAreYouSure;
    });
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections[this.index ?? 0].RemoveStructureAreYouSure = this.model;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections[this.index ?? 0].Status = this.model == 'yes' ? Status.Removed : Status.NoChanges;
    this.changeNumberOfSections();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections && this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections?.length > 0;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if(this.model == 'yes') {
      return this.navigationService.navigateRelative(WhyRemoveComponent.route, this.activatedRoute, { index: this.index });
    } else if (this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections!.filter(x => x.Status != Status.Removed)!.length > 1) {
      return this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { index: this.index });
  }

  isKbiComplete() {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
  }

  private changeNumberOfSections() {
    if (this.model == 'yes' && this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections.filter(x => x.Status != Status.Removed).length == 1) 
      this.changeNumberOfSectionsToOne()
    else if (this.model == 'no' && this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections.filter(x => x.Status != Status.Removed).length > 1) 
      this.changeNumberOfSectionsToTwoOrMore()
  }

  private changeNumberOfSectionsToOne() {
    this.applicationService.model.NumberOfSections = 'one';
    this.applicationService.updateApplication();
  }
  
  private changeNumberOfSectionsToTwoOrMore() {
    this.applicationService.model.NumberOfSections = 'two-or-more';
    this.applicationService.updateApplication();
  }

  get errorMessage() {
    return `Select 'yes' if you want to remove ${this.sectionName} from this application`;
  }

  get sectionName() {
    return this.applicationService.model.Sections[this.index ?? 0].Name;
  }

}
