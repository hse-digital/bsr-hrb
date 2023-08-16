import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { SectionCheckAnswersComponent } from '../check-answers/check-answers.component';
import { SectionNameComponent } from '../name/name.component';
import { ScopeAndDuplicateHelper } from 'src/app/helpers/scope-duplicate-helper';
import { BuildingOutOfScopeComponent } from '../../out-of-scope/out-of-scope.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './add-more-sections.component.html'
})
export class AddMoreSectionsComponent extends PageComponent<void> {
  static route: string = 'add-more'
  static title: string = "Add another high-rise residential structure - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  sections: SectionModel[] = [];

  anotherBlockHasErrors = false;
  addAnotherSectionLink?: string;

  get blockNames(): string | undefined {
    let blockNames = this.applicationService.model.Sections!.map(x => x.Name);
    return blockNames.join(', ');
  }

  override onInit(applicationService: ApplicationService): void {
    this.sections = this.applicationService.model.Sections;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> { }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.applicationService.model.Sections?.length >= 1;
  }

  override isValid(): boolean {
    this.anotherBlockHasErrors = !this.addAnotherSectionLink;
    return !this.anotherBlockHasErrors;
  }

  override async navigateNext(): Promise<boolean> {
    let nextPage = 'more-information';

    if (this.addAnotherSectionLink === 'yes') {
      console.log("yes");
      let section = this.applicationService.startNewSection();
      nextPage = `${section}/${SectionNameComponent.route}`;
      await this.applicationService.updateApplication();
      return this.navigationService.navigateRelative(nextPage, this.activatedRoute);
    } else {
      console.log("no");
      if (this.areAllSectionsOutOfScope()) {
        console.log("6802");
        // User navigates to 6802 'you do not need to register - all structure info entered'
        return this.navigationService.navigateRelative(`../${BuildingOutOfScopeComponent.route}`, this.activatedRoute);
      } else if (!this.areAllSectionsOutOfScope() && this.areAllSectionsDuplicated() && this.areAllSectionsRemoved()) {
        console.log("6498");
        // User navigates to 6498 'you do not need to register (building name) (4)'
      } else if (!this.areAllSectionsOutOfScope() && (!this.areAllSectionsDuplicated() || !this.areAllSectionsRemoved())) {
        console.log("no - check answers");
        return this.navigationService.navigateRelative(SectionCheckAnswersComponent.route, this.activatedRoute);
      }
    }

    console.log("check answers")
    return this.navigationService.navigateRelative(SectionCheckAnswersComponent.route, this.activatedRoute);
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
