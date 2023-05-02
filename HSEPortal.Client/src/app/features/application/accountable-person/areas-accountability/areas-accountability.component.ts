import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { AddAccountablePersonComponent } from '../add-accountable-person/add-accountable-person.component';
import { OrganisationNamedContactComponent } from '../organisation/named-contact/named-contact.component';
import { AccountabilityComponent } from 'src/app/components/accountability/accountability.component';

@Component({
  selector: 'hse-areas-accountability',
  templateUrl: './areas-accountability.component.html',
  styleUrls: ['./areas-accountability.component.scss']
})
export class AreasAccountabilityComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'areas-accountability';
  static title: string = "Areas of accountability - principal accountable person - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(AccountabilityComponent) accountabilityComponentes?: QueryList<AccountabilityComponent>;

  errors?: { checkboxGroupId: string, anchorId: string, message: string, shortMessage: string }[] = [];

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currentAccountablePerson.SectionsAccountability) {
      this.applicationService.currentAccountablePerson.SectionsAccountability = [];
    }

    for (let i = 0; i < this.applicationService.model.Sections.length; i++) {
      var section = this.applicationService.model.Sections[i];
      if (!this.applicationService.currentAccountablePerson.SectionsAccountability[i]) {
        this.applicationService.currentAccountablePerson.SectionsAccountability[i] = { SectionName: section.Name ?? this.applicationService.model.BuildingName!, Accountability: [] };
      }
    }
  }

  canContinue(): boolean {
    let canContinue = true;
    for (let i = 0; i < this.applicationService.model.Sections.length; i++) {
      var sectionAccountability = this.applicationService.currentAccountablePerson.SectionsAccountability![i];
      if (sectionAccountability.Accountability!.length == 0) {
        this.addError(i);
        canContinue = false;
      }
    }
    return canContinue;
  }

  addError(index: number) {
    let checkboxGroupId = this.createSectionId(index);
    let anchorId = `${checkboxGroupId}-${this.accountabilityComponentes?.find(x => x.id == checkboxGroupId)?.checkboxElements?.first.innerId}`;
    let errorMessage = `Select areas of ${this.getInfraestructureName(index)} that the ${this.getApName()} is accountable for`;
    let shortMessage = `Select accountability areas for ${this.getInfraestructureName(index)}`;
    if (!this.errors?.find(x => x.checkboxGroupId == checkboxGroupId)) {
      this.errors?.push({ checkboxGroupId: checkboxGroupId, anchorId: anchorId, message: errorMessage, shortMessage: shortMessage });
    }
  }

  getApName() {
    return this.applicationService.currentAccountablePerson.Type == 'organisation' ?
      this.applicationService.currentAccountablePerson.OrganisationName :
      `${this.applicationService.currentAccountablePerson.FirstName ?? this.applicationService.model.ContactFirstName} ${this.applicationService.currentAccountablePerson.LastName ?? this.applicationService.model.ContactLastName}`;
  }

  getInfraestructureName(index: number) {
    return this.applicationService.model.NumberOfSections != 'one'
      ? this.applicationService.model.Sections[index].Name
      : this.applicationService.model.BuildingName
  }

  getSectionError(sectionIndex: number) {
    return this.errors?.find(x => x.checkboxGroupId == this.createSectionId(sectionIndex))?.message ?? undefined;
  }

  getCheckboxTitle(index: number) {
    return `Which of these other areas of ${this.getInfraestructureName(index)} is ${this.getApName()} accountable for?`;
  }

  createSectionId(index: number) {
    return `section-${index}-AccountabilityCheckbox`;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currentAccountablePerson.Type == 'individual') {
      return navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, activatedRoute);
    }

    return navigationService.navigateRelative(OrganisationNamedContactComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
    //return ApHelper.isApAvailable(routeSnapshot, this.applicationService);
  }
}
