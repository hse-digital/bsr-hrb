import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { SectionHelper } from 'src/app/helpers/section-name-helper';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './more-information.component.html'
})
export class MoreInformationComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'more-information';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  inScopeSections?: SectionModel[];
  outOfScopeSections?: SectionModel[];
  ngOnInit(): void {
    this.outOfScopeSections = this.applicationService.model.Sections.filter(section => SectionHelper.isOutOfScope(section));
    this.inScopeSections = this.applicationService.model.Sections.filter(section => !SectionHelper.isOutOfScope(section));
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(`../accountable-person`, activatedRoute);
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
