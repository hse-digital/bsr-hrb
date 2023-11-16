import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, SectionAccountability, SectionModel } from 'src/app/services/application.service';
import { AccountabilityComponent } from 'src/app/components/accountability/accountability.component';
import { AccountabilityAreasHelper } from 'src/app/helpers/accountability-areas-helper';
import { AccountablePersonCheckAnswersComponent } from '../check-answers/check-answers.component';
import { NotAllocatedAccountabilityAreasComponent } from '../not-allocated-accountability-areas/not-allocated-accountability-areas.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-areas-accountability',
  templateUrl: './areas-accountability.component.html'
})
export class AreasAccountabilityComponent extends PageComponent<SectionAccountability[]> {
  static route: string = 'areas-accountability';
  static title: string = "Areas of accountability - principal accountable person - Register a high-rise building - GOV.UK";
  
  @ViewChildren(AccountabilityComponent) accountabilityComponentes?: QueryList<AccountabilityComponent>;
  
  errors?: { anchorId: string, message: string }[] = [];
  InScopeStructures?: SectionModel[];


  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  override onInit(applicationService: ApplicationService): void {
    this.InScopeStructures = this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope);
    if (!this.applicationService.currentVersion.AccountablePersons[0].SectionsAccountability) {
      this.applicationService.currentVersion.AccountablePersons[0].SectionsAccountability = [];
    }

    this.model = CloneHelper.DeepCopy(this.applicationService.currentVersion.AccountablePersons[0].SectionsAccountability);

    for (let i = 0; i < this.InScopeStructures.length; i++) {
      var section = this.InScopeStructures[i];
      if (!this.model![i]) {
        this.model![i] = { SectionName: section.Name ?? this.applicationService.model.BuildingName!, Accountability: [] };
      }
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentVersion.AccountablePersons[0].SectionsAccountability = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    let canContinue = true;
    this.errors = [];
    for (let i = 0; i < this.InScopeStructures!.length; i++) {
      var sectionAccountability = this.model![i];
      if (sectionAccountability.Accountability!.length == 0) {
        this.addError(i);
        canContinue = false;
      }
    }
    return canContinue;
  }

  override navigateNext(): Promise<boolean | void> {
    let thereAreNotAllocatedAreas = this.InScopeStructures!.some(x => AccountabilityAreasHelper.getNotAllocatedAreasOf(this.applicationService.currentVersion.AccountablePersons, this.applicationService.model.BuildingName!, x).length > 0);
    if (thereAreNotAllocatedAreas) {
      return this.navigationService.navigateRelative(NotAllocatedAccountabilityAreasComponent.route, this.activatedRoute);
    } else {
      return this.navigationService.navigateRelative(AccountablePersonCheckAnswersComponent.route, this.activatedRoute);
    }
  }

  addError(index: number) {
    let anchorId = this.getAnchorId(index);
    let errorMessage = `Select areas of ${this.getInfraestructureName(index)} that the Principle Accountable Person is accountable for`;
    if (!this.errors?.find(x => x.anchorId == anchorId)) {
      this.errors?.push({ anchorId: anchorId, message: errorMessage });
    }
  }

  getSectionError(sectionIndex: number) {
    let anchorId = this.getAnchorId(sectionIndex);
    return this.errors?.find(x => x.anchorId == anchorId)?.message ?? undefined;
  }

  private getAnchorId(sectionIndex: number) {
    let checkboxGroupId = this.createSectionId(sectionIndex);
    return `${checkboxGroupId}-${this.accountabilityComponentes?.find(x => x.id == checkboxGroupId)?.checkboxElements?.first.innerId}`;
  }

  getApName() {
    let pap = this.applicationService.currentVersion.AccountablePersons[0];
    return pap.Type == 'organisation' ? pap.OrganisationName :
      `${pap.FirstName ?? this.applicationService.model.ContactFirstName} ${pap.LastName ?? this.applicationService.model.ContactLastName}`;
  }

  getInfraestructureName(index: number) {
    return this.applicationService.model.NumberOfSections != 'one'
      ? this.InScopeStructures![index].Name
      : this.applicationService.model.BuildingName
  }

  getCheckboxTitle(index: number) {
    return `Which of these other areas of ${this.getInfraestructureName(index)} is ${this.getApName()} accountable for?`;
  }

  createSectionId(index: number) {
    return `section-${index}-AccountabilityCheckbox`;
  }
}
