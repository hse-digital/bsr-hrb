import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { OutgoingAccountabilityComponent } from "src/app/components/outgoing-accountability/outgoing-accountability.component";
import { AccountabilityAreasHelper } from "src/app/helpers/accountability-areas-helper";
import { CloneHelper } from "src/app/helpers/array-helper";
import { PageComponent } from "src/app/helpers/page.component";
import { ApplicationService, SectionAccountability, SectionModel } from "src/app/services/application.service";
import { AreasAccountabilityComponent } from "../areas-accountability/areas-accountability.component";

@Component({
  templateUrl: './outgoing-accountability.component.html'
})
export class OutgoingAccountabilityPageComponent extends PageComponent<SectionAccountability[]> {
  static route: string = 'outgoing-accountability';
  static title: string = "Review these areas of accountability - Register a high-rise building - GOV.UK";


  @ViewChildren(OutgoingAccountabilityComponent) accountabilityComponentes?: QueryList<OutgoingAccountabilityComponent>;

  errors?: { anchorId: string, message: string }[] = [];
  InScopeStructures?: SectionModel[];

  override onInit(applicationService: ApplicationService): void | Promise<void> {
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

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
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

  addError(index: number) {
    let anchorId = this.getAnchorId(index);
    let errorMessage = `Select the areas that ${this.getApName()} will still be accountable for or select that they are no longer accountable for any areas.`;
    if (!this.errors?.find(x => x.anchorId == anchorId)) {
      this.errors?.push({ anchorId: anchorId, message: errorMessage });
    }
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(AreasAccountabilityComponent.route, this.activatedRoute);
  }

  createSectionId(index: number) {
    return `section-${index}-AccountabilityCheckbox`;
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
    let pap = this.applicationService.previousVersion.AccountablePersons[0];
    return pap.Type == 'organisation' ? pap.OrganisationName :
      `${pap.FirstName ?? this.applicationService.model.ContactFirstName} ${pap.LastName ?? this.applicationService.model.ContactLastName}`;
  }

  getCheckboxTitle(index: number) {
    return `Which areas of ${this.getInfraestructureName(index)} are they still accountable for?`;
  }

  getInfraestructureName(index: number) {
    return this.applicationService.model.NumberOfSections != 'one'
      ? this.InScopeStructures![index].Name
      : this.applicationService.model.BuildingName
  }

}
