import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AccountablePersonModel, ApplicationService, SectionModel, Status } from 'src/app/services/application.service';
import { AccountabilityAreasHelper } from 'src/app/helpers/accountability-areas-helper'
import { NotAllocatedAccountabilityComponent } from 'src/app/components/not-allocated-accountability/not-allocated-accountability.component';
import { AccountablePersonCheckAnswersComponent } from '../check-answers/check-answers.component';
import { AddAccountablePersonComponent } from '../add-accountable-person/add-accountable-person.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-not-allocated-accountability-areas',
  templateUrl: './not-allocated-accountability-areas.component.html'
})
export class NotAllocatedAccountabilityAreasComponent extends PageComponent<AccountablePersonModel[]> {
  static route: string = 'not-allocated-accountability';
  static title: string = "Allocate all areas of accountability - Register a high-rise building - GOV.UK";

  @ViewChildren(NotAllocatedAccountabilityComponent) checkboxes?: QueryList<NotAllocatedAccountabilityComponent>;

  InScopeStructures?: SectionModel[];

  errors?: { anchorId: string, message: string }[] = [];
  notAllocatedAreas: string[][] = []

  areasAccountabilityMapper: Record<string, string> = {
    "routes": "routes that residents can walk through",
    "maintenance": "maintaining machinery and equipment",
    "facilities": "facilities that residents share",
  }



  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  override onInit(applicationService: ApplicationService): void {
    this.model = CloneHelper.DeepCopy(this.applicationService.currentVersion.AccountablePersons);
    this.InScopeStructures = this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope && x.Status != Status.Removed);
    this.InScopeStructures.forEach(section => {
      this.notAllocatedAreas.push(AccountabilityAreasHelper.getNotAllocatedAreasOf(this.model!, this.applicationService.model.BuildingName!, section))
    });
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentVersion.AccountablePersons = CloneHelper.DeepCopy(this.model!);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope && x.Status != Status.Removed)!.some(x => AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService.currentVersion.AccountablePersons, this.applicationService.model.BuildingName!, x).length > 0);
  }

  override isValid(): boolean {
    let canContinue = true;
    this.errors = [];
    this.InScopeStructures!.forEach((section, index) => {
      let notAllocatedAreas = AccountabilityAreasHelper.getNotAllocatedAreasOf(this.model!, this.applicationService.model.BuildingName!, section);
      if (notAllocatedAreas.length != 0) {
        canContinue = false;
        this.addError(section, index, notAllocatedAreas);
      }
    });
    return canContinue;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(AccountablePersonCheckAnswersComponent.route, this.activatedRoute);
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
      ? this.InScopeStructures![index].Name
      : this.applicationService.model.BuildingName
  }

  updateAccountabilityAreas(accountablePersonIndex: number, section: SectionModel, area: string) {
    let accountability = AccountabilityAreasHelper.updateAccountabilityAreas(this.model!, this.applicationService.model.BuildingName!, accountablePersonIndex, section, area);
    this.setAccountabilityFor(accountablePersonIndex, section, accountability);
  }

  private setAccountabilityFor(accountablePersonIndex: number, section: SectionModel, newAccountability: string[]) {
    let sectionAccountability = this.model![accountablePersonIndex].SectionsAccountability!
      .find(x => x.SectionName == (section.Name ?? this.applicationService.model.BuildingName));

    if (!sectionAccountability) {
      this.model![accountablePersonIndex].SectionsAccountability!.push({ SectionName: section.Name ?? this.applicationService.model.BuildingName!, Accountability: newAccountability });
    } else {
      sectionAccountability.Accountability = newAccountability;
    }
  }

  navigateToAddMoreAccountablePersons() {
    this.navigationService.navigateRelative(AddAccountablePersonComponent.route, this.activatedRoute);
  }
}
