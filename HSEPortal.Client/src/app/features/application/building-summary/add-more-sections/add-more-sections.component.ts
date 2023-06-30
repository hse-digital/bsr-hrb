import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { SectionCheckAnswersComponent } from '../check-answers/check-answers.component';
import { SectionNameComponent } from '../name/name.component';
import { ScopeAndDuplicateHelper } from 'src/app/helpers/scope-duplicate-helper';

@Component({
  templateUrl: './add-more-sections.component.html'
})
export class AddMoreSectionsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'add-more'
  static title: string = "Add another high-rise residential structure - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
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

  override canAccess(_: ActivatedRouteSnapshot) {
    return this.applicationService.model.Sections?.length >= 1;
  }

  async navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextPage = 'more-information';

    if (this.addAnotherSectionLink === 'yes') {
      let section = this.applicationService.startNewSection();
      nextPage = `${section}/${SectionNameComponent.route}`;
      await this.applicationService.updateApplication();
      return navigationService.navigateRelative(nextPage, activatedRoute);
    } else {
      if (this.areAllSectionsOutOfScope()) {
        // User navigates to 6802 'you do not need to register - all structure info entered'
      } else if (!this.areAllSectionsOutOfScope() && this.areAllSectionsDuplicated() && this.areAllSectionsRemoved()) {
        // User navigates to 6498 'you do not need to register (building name) (4)'
      } else if (!this.areAllSectionsOutOfScope() && (!this.areAllSectionsDuplicated() || !this.areAllSectionsRemoved())) {
        return navigationService.navigateRelative(SectionCheckAnswersComponent.route, activatedRoute);
      }
    }

    return navigationService.navigateRelative(SectionCheckAnswersComponent.route, activatedRoute);
  }

  private areAllSectionsOutOfScope() {
    return ScopeAndDuplicateHelper.AreAllSectionsOutOfScope(this.applicationService);
  }

  private areAllSectionsDuplicated() {
    return ScopeAndDuplicateHelper.AreAllSectionsDuplicated(this.applicationService);
  }

  private areAllSectionsRemoved() {
    return ScopeAndDuplicateHelper.AreAllSectionsRemoved(this.applicationService);
  }

  getSectionNames() {
    if (this.sections.length == 1) {
      return this.sections.map((section, index) => this.getSectionName(section, index)).join(', ');
    }

    return this.sections.slice(0, this.sections.length - 1).map((section, index) => this.getSectionName(section, index)).join(', ');
  }

  getSectionName(section: SectionModel, index: number) {
    return section.Name ?? SectionHelper.getSectionCardinalName(index);
  }
}
