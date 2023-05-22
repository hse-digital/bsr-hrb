import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { SectionFloorsAboveComponent } from '../floors-above/floors-above.component';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: './name.component.html'
})
export class SectionNameComponent extends BaseComponent implements IHasNextPage, OnInit {

  static route: string = 'name';
  static title: string = "High-rise residential structure name - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  blockNameHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  sections: SectionModel[] = [];
  ngOnInit(): void {
    this.sections = this.applicationService.model.Sections.slice(0, this.applicationService.model.Sections.length - 1);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionFloorsAboveComponent.route, activatedRoute);
  }

  getSectionNames() {
    return this.sections.slice(0, this.sections.length - 1).map((section, index) => this.getSectionName(section, index)).join(', ');
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

  public override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService) && this.applicationService.model.NumberOfSections === "two_or_more";
  }
}