import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { AccountabilityAreasHelper } from 'src/app/helpers/accountability-areas-helper'
import { NotAllocatedAccountabilityComponent } from 'src/app/components/not-allocated-accountability/not-allocated-accountability.component';
import { AccountablePersonCheckAnswersComponent } from '../check-answers/check-answers.component';
import { AddAccountablePersonComponent } from '../add-accountable-person/add-accountable-person.component';

@Component({
  selector: 'hse-not-allocated-accountability-areas',
  templateUrl: './not-allocated-accountability-areas.component.html'
})
export class NotAllocatedAccountabilityAreasComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'not-allocated-accountability';
  static title: string = "Allocate all areas of accountability - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(NotAllocatedAccountabilityComponent) checkboxes?: QueryList<NotAllocatedAccountabilityComponent>;

  errors?: { anchorId: string, message: string }[] = [];
  notAllocatedAreas: string[][] = []

  areasAccountabilityMapper: Record<string, string> = {
    "routes": "routes that residents can walk through",
    "maintenance": "maintaining machinery and equipment",
    "facilities": "facilities that residents share",
  }

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.applicationService.model.Sections.forEach(section => {
      this.notAllocatedAreas.push(AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService, section))
    });
  }

  canContinue(): boolean {
    let canContinue = true;
    this.errors = [];
    this.applicationService.model.Sections.forEach((section, index) => {
      let notAllocatedAreas = AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService, section);
      if (notAllocatedAreas.length != 0) {
        canContinue = false;
        this.addError(section, index, notAllocatedAreas);
      }
    });
    return canContinue;
  }

  private addError(section: SectionModel, sectionIndex: number, notAllocatedAreas: string[]) {
    notAllocatedAreas.forEach((area) => {
      let anchorId = this.getAnchorId(sectionIndex, area);
      let errorMessage = `Select who is accountable for ${this.areasAccountabilityMapper[area]} in ${section.Name ?? this.applicationService.model.BuildingName}`;
      if (!this.errors?.find(x => x.anchorId == anchorId)) {
        this.errors?.push({ anchorId: anchorId, message: errorMessage });
      }
    });
  }

  getSectionError(sectionIndex: number, area: string) {
    let anchorId = this.getAnchorId(sectionIndex, area);
    return this.errors?.find(x => x.anchorId == anchorId)?.message ?? undefined;
  }

  createSectionId(index: number, area: string) {
    return `${area}-${index}`;
  }

  private getAnchorId(sectionIndex: number, area: string) {
    let checkboxGroupId = this.createSectionId(sectionIndex, area);
    return `${checkboxGroupId}-${this.checkboxes?.find(x => x.id == checkboxGroupId)?.checkboxElements?.first?.innerId}`;
  }

  getCheckboxTitle(index: number, areaOfAccountability: string) {
    return `Who is accountable for ${this.areasAccountabilityMapper[areaOfAccountability]} in ${this.getInfraestructureName(index)}?`;
  }

  private getInfraestructureName(index: number) {
    return this.applicationService.model.NumberOfSections != 'one'
      ? this.applicationService.model.Sections[index].Name
      : this.applicationService.model.BuildingName
  }

  updateAccountabilityAreas(accountablePersonIndex: number, section: SectionModel, area: string) {
    let accountability = AccountabilityAreasHelper.updateAccountabilityAreas(this.applicationService, accountablePersonIndex, section, area);
    this.setAccountabilityFor(accountablePersonIndex, section, accountability);
  }

  private setAccountabilityFor(accountablePersonIndex: number, section: SectionModel, newAccountability: string[]) {
    let sectionAccountability = this.applicationService.model.AccountablePersons[accountablePersonIndex].SectionsAccountability!
      .find(x => x.SectionName == (section.Name ?? this.applicationService.model.BuildingName));

    if (!sectionAccountability) {
      this.applicationService.model.AccountablePersons[accountablePersonIndex].SectionsAccountability!.push({ SectionName: section.Name ?? this.applicationService.model.BuildingName!, Accountability: newAccountability });
    } else {
      sectionAccountability.Accountability = newAccountability;
    }
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(AccountablePersonCheckAnswersComponent.route, activatedRoute);
  }

  navigateToAddMoreAccountablePersons() {
    this.navigationService.navigateRelative(AddAccountablePersonComponent.route, this.activatedRoute);
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    return this.applicationService.model.Sections.some(x => AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService, x).length > 0)
  }
}
