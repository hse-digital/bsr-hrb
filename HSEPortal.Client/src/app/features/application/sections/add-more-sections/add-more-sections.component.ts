import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { SectionCheckAnswersComponent } from '../check-answers/check-answers.component';
import { SectionNameComponent } from '../name/name.component';
import { SectionHelper } from 'src/app/helpers/section-name-helper';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: './add-more-sections.component.html'
})
export class AddMoreSectionsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'add-more'
  static title: string = "Add another high-rise residential structure - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
    
  }

  sections: SectionModel[] = [];
  ngOnInit(): void {
    this.sections = this.applicationService.model.Sections;
  }

  anotherBlockHasErrors = false;
  addAnotherSectionLink?: string;
  canContinue(): boolean {
    this.anotherBlockHasErrors = !this.addAnotherSectionLink;
    return !this.anotherBlockHasErrors;
  }

  get blockNames(): string | undefined {
    let blockNames = this.applicationService.model.Sections!.map(x => x.Name);
    return blockNames.join(', ');
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.PeopleLivingInBuilding;
  }

  async navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextPage = 'more-information';

    if (this.addAnotherSectionLink === 'yes') {
      let section = this.applicationService.startNewSection();
      nextPage = `${section}/${SectionNameComponent.route}`;
      await this.applicationService.updateApplication();
      return navigationService.navigateRelative(nextPage, activatedRoute);
    }

    return navigationService.navigateRelative(SectionCheckAnswersComponent.route, activatedRoute);
  }

  getSectionNames() {
    return this.sections.slice(0, this.sections.length - 1).map((section, index) => this.getSectionName(section, index)).join(', ');
  }

  getSectionName(section: SectionModel, index: number) {
    return section.Name ?? SectionHelper.getSectionCardinalName(index);
  }
}
