import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, ChangeSection, OutOfScopeReason, Status } from 'src/app/services/application.service';
import { BuildingChangeCheckAnswersComponent } from '../building-change-check-answers/building-change-check-answers.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { WhyRemoveComponent } from '../why-remove/why-remove.component';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';
import { ApplicationCompletedComponent } from 'src/app/features/application/application-completed/application-completed.component';
import { SectionHeightComponent } from 'src/app/features/application/building-summary/height/height.component';
import { SectionPeopleLivingInBuildingComponent } from 'src/app/features/application/building-summary/people-living-in-building/people-living-in-building.component';
import { SectionResidentialUnitsComponent } from 'src/app/features/application/building-summary/residential-units/residential-units.component';
import { DeregisterApplicationNumberComponent } from '../../change-deregister/deregister-application-number/deregister-application-number.component';
import { DeregisterWhyComponent } from '../../change-deregister/deregister-why/deregister-why.component';

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
    let isOutOfScope = this.applicationService.currentChangedSection.SectionModel?.Scope?.IsOutOfScope;
    let outOfScopeRoute = this.getNextOutOfScopeRoute(this.applicationService.currentChangedSection.SectionModel?.Scope?.OutOfScopeReason);
    if (this.model == 'no' && isOutOfScope && FieldValidations.IsNotNullOrWhitespace(outOfScopeRoute)) {
      this.applicationService.currentChangedSection.SectionModel!.Scope = {};
      return this.navigateToSectionPage(outOfScopeRoute);
    } else if(this.model == 'yes') {
      return this.navigationService.navigateRelative(WhyRemoveComponent.route, this.activatedRoute, { index: this.index });
    } else if (this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections!.filter(x => x.Status != Status.Removed)!.length > 1) {
      return this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { index: this.index });
  }

  navigateToSectionPage(url: string, query?: string) {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentChange = url;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.CurrentSectionIndex = this.applicationService._currentSectionIndex;
    this.applicationService.updateApplication();
    return this.navigationService.navigateRelative(`../sections/section-${this.applicationService._currentSectionIndex + 1}/${url}`, this.activatedRoute);
  }

  private getNextOutOfScopeRoute(outOfScopeReason?: OutOfScopeReason) {
    switch(outOfScopeReason) {
      case OutOfScopeReason.Height: return SectionHeightComponent.route;
      case OutOfScopeReason.NumberResidentialUnits: return SectionResidentialUnitsComponent.route;
      case OutOfScopeReason.PeopleLivingInBuilding: return SectionPeopleLivingInBuildingComponent.route;
    }
    return ""
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
