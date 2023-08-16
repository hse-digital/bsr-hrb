import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
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



  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.currentSection?.Name;
    this.sections = this.applicationService.model.Sections.slice(0, this.applicationService.model.Sections.length - 1);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.currentSection.Name = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService) && this.applicationService.model.NumberOfSections === "two_or_more";
  }

  override isValid(): boolean {
    this.blockNameHasErrors = !this.model;
    return !this.blockNameHasErrors;
  }

  override navigateNext(): Promise<boolean> {
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
