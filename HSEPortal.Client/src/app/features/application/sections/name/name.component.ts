import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { SectionFloorsAboveComponent } from '../floors-above/floors-above.component';
import { SectionHelper } from 'src/app/helpers/section-name-helper';
import { GovukErrorSummaryComponent } from 'hse-angular';

@Component({
  templateUrl: './name.component.html'
})
export class SectionNameComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'name';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  blockNameHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  sections: SectionModel[] = [];
  ngOnInit(): void {
    this.sections = this.applicationService.model.Sections.slice(0, this.applicationService.model.Sections.length-1);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionFloorsAboveComponent.route, activatedRoute);
  }

  getSectionNames() {
    return this.sections.slice(0, this.sections.length - 1).map((section, index) => this.getSectionName(section, index)).join(', ');
  }

  getAndName() {
    return 'oi';
  }

  getSectionName(section: SectionModel, index: number) {
    return section?.Name ?? SectionHelper.getSectionCardinalName(index);
  }

  getCurrentStructureName() {
    return SectionHelper.getSectionCardinalName(this.applicationService._currentSectionIndex);
  }

  public canContinue(): boolean {
    this.blockNameHasErrors = !this.applicationService.currentSection?.Name;
    return !this.blockNameHasErrors;
  }
}
