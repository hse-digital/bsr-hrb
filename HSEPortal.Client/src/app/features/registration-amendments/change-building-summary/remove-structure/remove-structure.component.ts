import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, OutOfScopeReason, Status } from 'src/app/services/application.service';
import { BuildingChangeCheckAnswersComponent } from '../building-change-check-answers/building-change-check-answers.component';
import { WhyRemoveComponent } from '../why-remove/why-remove.component';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { SectionHeightComponent } from 'src/app/features/application/building-summary/height/height.component';
import { SectionPeopleLivingInBuildingComponent } from 'src/app/features/application/building-summary/people-living-in-building/people-living-in-building.component';
import { SectionResidentialUnitsComponent } from 'src/app/features/application/building-summary/residential-units/residential-units.component';
import { CancellationReason } from 'src/app/services/registration-amendments.service';

@Component({
  selector: 'hse-remove-structure',
  templateUrl: './remove-structure.component.html'
})
export class RemoveStructureComponent extends PageComponent<string> {
  static route: string = 'remove-structure';
  static title: string = "Confirm you want to remove this structure - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  index?: number;
  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.activatedRoute.queryParams.subscribe(params => {
      this.index = params['index'];
      if (!this.index) this.navigationService.navigate(NotFoundComponent.route);
    });
    this.model = this.applicationService.currentVersion.Sections[this.index!].RemoveStructureAreYouSure;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentVersion.Sections[this.index!].RemoveStructureAreYouSure = this.model;
    this.applicationService.currentVersion.Sections[this.index!].Status = this.model == 'yes' ? Status.Removed : Status.NoChanges;
    if (this.model == 'no') {
      this.applicationService.currentVersion.Sections[this.index!].CancellationReason = CancellationReason.NoCancellationReason;
    } else {
      this.updateConnectionsStatus();
      this.resetAreasAccountability();
    }
    
    this.changeNumberOfSections();
  }

  private updateConnectionsStatus() {
    if (!!this.applicationService.currentVersion.Kbi && !!this.applicationService.currentVersion.Kbi.Connections) {
      this.applicationService.currentVersion.Kbi.Connections.Status = Status.ChangesInProgress;
    }
  }

  private resetAreasAccountability() {
    let InScopeStructures = this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope && x.Status != Status.Removed);
    
    for (let index = 0; index < this.applicationService.currentVersion.AccountablePersons.length; index++) {
      this.applicationService.currentVersion.AccountablePersons[index].SectionsAccountability = [];
        
      for (let i = 0; i < InScopeStructures.length; i++) {
        var section = InScopeStructures[i];
        if (!this.applicationService.currentVersion.AccountablePersons[index].SectionsAccountability![i]) {
          this.applicationService.currentVersion.AccountablePersons[index].SectionsAccountability![i] = { SectionName: section.Name ?? this.applicationService.model.BuildingName!, Accountability: [] };
        }
      } 
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    let isOutOfScope = this.applicationService.currentSection.Scope?.IsOutOfScope;
    let outOfScopeRoute = this.getNextOutOfScopeRoute(this.applicationService.currentSection?.Scope?.OutOfScopeReason);
    
    if (this.model == 'no' && isOutOfScope && FieldValidations.IsNotNullOrWhitespace(outOfScopeRoute)) {
      this.applicationService.currentSection!.Scope = {};
      return this.navigateToSectionPage(outOfScopeRoute);
    } else if(this.model == 'yes') {
      return this.navigationService.navigateRelative(WhyRemoveComponent.route, this.activatedRoute, { index: this.index });
    } else if (this.applicationService.currentVersion.Sections!.filter(x => x.Status != Status.Removed)!.length > 1) {
      return this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { index: this.index });
  }

  navigateToSectionPage(url: string, query?: string) {
    this.applicationService.updateApplication();
    return this.navigationService.navigateRelative(`../sections/section-${this.applicationService._currentSectionIndex + 1}/${url}`, this.activatedRoute, {
      return: 'building-change-check-answers'
    });
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
    if (this.model == 'yes' && this.applicationService.currentVersion.Sections.filter(x => x.Status != Status.Removed).length == 1) 
      this.changeNumberOfSectionsToOne()
    else if (this.model == 'no' && this.applicationService.currentVersion.Sections.filter(x => x.Status != Status.Removed).length > 1) 
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
    return this.applicationService.currentVersion.Sections[this.index!].Name;
  }

}
