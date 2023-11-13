import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';

@Component({
  templateUrl: './more-information.component.html'
})
export class MoreInformationComponent extends PageComponent<void> {
  static route: string = 'more-information';
  static title: string = "Which high-rise residential structure are in scope - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  inScopeSections?: SectionModel[];
  outOfScopeSections?: SectionModel[];

  override onInit(applicationService: ApplicationService): void {
    this.outOfScopeSections = this.applicationService.currentVersion.Sections.filter(section => SectionHelper.isOutOfScope(section));
    this.inScopeSections = this.applicationService.currentVersion.Sections.filter(section => !SectionHelper.isOutOfScope(section));
  }

  override async onSave(applicationService: ApplicationService): Promise<void> { }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let outOfScope = this.applicationService.currentVersion.Sections.filter(section => SectionHelper.isOutOfScope(section));
    return outOfScope?.length > 0;
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(`../accountable-person`, this.activatedRoute);
  }

  getInScopeSectionNames() {
    return this.inScopeSections?.map((section, index) => section.Name ?? SectionHelper.getSectionCardinalName(index));
  }

  getOutOfScopeSectionNames() {
    return this.outOfScopeSections?.map((section, index) => section.Name ?? SectionHelper.getSectionCardinalName(index));
  }

  getSectionNames(sections: SectionModel[]) {
    if (sections.length == 1)
      return sections.map(x => this.getSectionName(x, 0));

    return sections.slice(0, sections.length - 1).map((section, index) => this.getSectionName(section, index)).join(', ');
  }

  getSectionName(section: SectionModel, index: number) {
    return section.Name ?? SectionHelper.getSectionCardinalName(index);
  }

}
