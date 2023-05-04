import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { AccountabilityComponent } from 'src/app/components/accountability/accountability.component';

@Component({
  selector: 'hse-areas-accountability',
  templateUrl: './areas-accountability.component.html'
})
export class AreasAccountabilityComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'areas-accountability';
  static title: string = "Areas of accountability - principal accountable person - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(AccountabilityComponent) accountabilityComponentes?: QueryList<AccountabilityComponent>;

  errors?: { anchorId: string, message: string }[] = [];

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.model.AccountablePersons[0].SectionsAccountability) {
      this.applicationService.model.AccountablePersons[0].SectionsAccountability = [];
    }

    for (let i = 0; i < this.applicationService.model.Sections.length; i++) {
      var section = this.applicationService.model.Sections[i];
      if (!this.applicationService.model.AccountablePersons[0].SectionsAccountability[i]) {
        this.applicationService.model.AccountablePersons[0].SectionsAccountability[i] = { SectionName: section.Name ?? this.applicationService.model.BuildingName!, Accountability: [] };
      }
    }
  }
  
  canContinue(): boolean {
    let canContinue = true;
    this.errors = [];
    for (let i = 0; i < this.applicationService.model.Sections.length; i++) {
      var sectionAccountability = this.applicationService.model.AccountablePersons[0].SectionsAccountability![i];
      if (sectionAccountability.Accountability!.length == 0) {
        this.addError(i);
        canContinue = false;
      }
    }
    return canContinue;
  }

  addError(index: number) {
    let anchorId = this.getAnchorId(index);
    let errorMessage = `Select areas of ${this.getInfraestructureName(index)} that the ${this.getApName()} is accountable for`;
    if (!this.errors?.find(x => x.anchorId == anchorId)) {
      this.errors?.push({ anchorId: anchorId, message: errorMessage });
    }
  }

  getSectionError(sectionIndex: number) {
    let anchorId = this.getAnchorId(sectionIndex);
    return this.errors?.find(x => x.anchorId == anchorId)?.message ?? undefined;
  }

  private getAnchorId(sectionIndex: number){
    let checkboxGroupId = this.createSectionId(sectionIndex);
    return `${checkboxGroupId}-${this.accountabilityComponentes?.find(x => x.id == checkboxGroupId)?.checkboxElements?.first.innerId}`;
  }

  getApName() {
    return this.applicationService.currentAccountablePerson.Type == 'organisation' ?
      this.applicationService.model.AccountablePersons[0].OrganisationName :
      `${this.applicationService.model.AccountablePersons[0].FirstName ?? this.applicationService.model.ContactFirstName} ${this.applicationService.model.AccountablePersons[0].LastName ?? this.applicationService.model.ContactLastName}`;
  }

  getInfraestructureName(index: number) {
    return this.applicationService.model.NumberOfSections != 'one'
      ? this.applicationService.model.Sections[index].Name
      : this.applicationService.model.BuildingName
  }

  getCheckboxTitle(index: number) {
    return `Which of these other areas of ${this.getInfraestructureName(index)} is ${this.getApName()} accountable for?`;
  }

  createSectionId(index: number) {
    return `section-${index}-AccountabilityCheckbox`;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('', activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }
}
