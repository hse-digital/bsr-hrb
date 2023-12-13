import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, SectionModel, Status } from 'src/app/services/application.service';
import { SectionFloorsAboveComponent } from '../floors-above/floors-above.component';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './name.component.html'
})
export class SectionNameComponent extends PageComponent<string> {
  static route: string = 'name';
  static title: string = "High-rise residential structure name - Register a high-rise building - GOV.UK";

  blockNameHasErrors = false;
  reset: boolean = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  newStructureIndex?: number;
  override onInit(applicationService: ApplicationService): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let index = params['index'];
      this.reset = params['reset'];
      this.newStructureIndex = (index == (this.applicationService.currentVersion.Sections.length - 1) ? index : undefined);
    });

    this.model = applicationService.currentSection?.Name;
    this.sections = this.applicationService.currentVersion.Sections.slice(0, this.applicationService.currentVersion.Sections.length - 1);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.currentSection.Name = this.model;

    if (this.applicationService.isChangeAmendmentInProgress && this.reset) {
      this.resetAreasAccountability();
    }
    
    if (this.kbiExists() && this.kbiSectionExists()) {
      this.applicationService.currentVersion.Kbi!.KbiSections.at(this.applicationService._currentSectionIndex)!.StructureName = this.model;
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

  private kbiSectionExists() {
    return !!this.applicationService.currentVersion.Kbi?.KbiSections.at(this.applicationService._currentSectionIndex);
  }

  private kbiExists() {
    return !!this.applicationService.currentVersion.Kbi && !!this.applicationService.currentVersion.Kbi.KbiSections && this.applicationService.currentVersion.Kbi.KbiSections.length > 0;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService) && this.applicationService.model.NumberOfSections != "one";
  }

  override isValid(): boolean {
    this.blockNameHasErrors = !this.model;
    return !this.blockNameHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    if(!!this.newStructureIndex && this.newStructureIndex > 0) {
      let sectionIndex = Number(this.newStructureIndex) + 1;
      this.model = "";
      return this.navigationService.navigateRelative(`../section-${sectionIndex}/name`, this.activatedRoute, { reset: true });
    } 
    return this.navigationService.navigateRelative(SectionFloorsAboveComponent.route, this.activatedRoute);
  }

  sections: SectionModel[] = [];
  
  getSectionNames() {
    return this.sections.slice(0, this.sections.length - 1).map((section, index) => this.getSectionName(section, index)).join(', ');
  }

  getSectionName(section: SectionModel, index: number) {
    return section?.Name ?? SectionHelper.getSectionCardinalName(index);
  }

  getCurrentStructureName() {
    return SectionHelper.getSectionCardinalName(this.applicationService._currentSectionIndex);
  }

}
