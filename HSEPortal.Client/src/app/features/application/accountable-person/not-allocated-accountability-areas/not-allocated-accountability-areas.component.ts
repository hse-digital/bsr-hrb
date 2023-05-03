import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukCheckboxComponent, GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { AccountablePersonModel, ApplicationService, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { AddAccountablePersonComponent } from '../add-accountable-person/add-accountable-person.component';
import { OrganisationNamedContactComponent } from '../organisation/named-contact/named-contact.component';

@Component({
  selector: 'hse-not-allocated-accountability-areas',
  templateUrl: './not-allocated-accountability-areas.component.html',
  styleUrls: ['./not-allocated-accountability-areas.component.scss']
})
export class NotAllocatedAccountabilityAreasComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'not-allocated-accountability';
  static title: string = "Allocate all areas of accountability - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errors?: { checkboxGroupId: string, anchorId: string, message: string }[] = [];

  areasOfAccountability: string[] = ["routes", "maintenance", "facilities", "none"];
  areasAccountabilityMapper: Record<string, string> = {
    "routes": "routes that residents can walk through",
    "maintenance": "maintaining machinery and equipment",
    "facilities": "facilities that residents share",
    "none": "structure and exterior",
  }

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    let canContinue = true;
    this.errors = [];
    this.applicationService.model.Sections.forEach((section, index) => {
      let notAllocatedAreas = this.getNotAllocatedAreasOf(section);
      if (notAllocatedAreas.length != 0) {
        canContinue = false;
        console.log(section, index, notAllocatedAreas);
        this.addError(section, index, notAllocatedAreas);
      }
    });
    return canContinue;
  }

  addError(section: SectionModel, sectionIndex: number, notAllocatedAreas: string[]) {
    notAllocatedAreas.forEach((area) => {
      let checkboxGroupId = this.createSectionId(sectionIndex, area);
      let anchorId = `${checkboxGroupId}-${this.checkboxes?.find(x => x.id.startsWith(checkboxGroupId))?.innerId}`;
      let errorMessage = `Select who is accountable for ${this.areasAccountabilityMapper[area]} in ${section.Name ?? this.applicationService.model.BuildingName}`;
      if (!this.errors?.find(x => x.anchorId == anchorId)) {
        this.errors?.push({ checkboxGroupId: checkboxGroupId, anchorId: anchorId, message: errorMessage });
      }
    });
  }

  get accountablePersons(): string[] {
    let persons = this.applicationService.model!.AccountablePersons!;
    let accountablePersonNames: string[] = [];
    for (let i: number = 0; i < persons.length; i++) {
      if (persons[i].Type == 'organisation') {
        accountablePersonNames.push(persons[i].OrganisationName ?? "");
      } else {
        accountablePersonNames.push(`${persons[i].FirstName ?? this.applicationService.model.ContactFirstName} ${persons[i].LastName ?? this.applicationService.model.ContactLastName}`);
      }
    }
    return accountablePersonNames;
  }

  getAccountablePersonName(person: AccountablePersonModel) {
    return person.Type == 'organisation' ?
      person.OrganisationName :
      `${person.FirstName ?? this.applicationService.model.ContactFirstName} ${person.LastName ?? this.applicationService.model.ContactLastName}`;
  }

  getInfraestructureName(index: number) {
    return this.applicationService.model.NumberOfSections != 'one'
      ? this.applicationService.model.Sections[index].Name
      : this.applicationService.model.BuildingName
  }

  getSectionError(sectionIndex: number, area: string) {
    let checkboxGroupId = this.createSectionId(sectionIndex, area);
    let anchorId = `${checkboxGroupId}-${this.checkboxes?.find(x => x.id.startsWith(checkboxGroupId))?.innerId}`;
    return this.errors?.find(x => x.anchorId == anchorId)?.message ?? undefined;
  }

  getCheckboxTitle(index: number, areaOfAccountability: string) {
    return `Who is accountable for ${this.areasAccountabilityMapper[areaOfAccountability]} in ${this.getInfraestructureName(index)}?`;
  }

  createSectionId(index: number, area: string) {
    return `section-${area}-${index}-checkbox`;
  }

  getNotAllocatedAreasOf(section: SectionModel) {
    let accountabilityAreasOfSection = this.applicationService.model.AccountablePersons
      .flatMap(x => x.SectionsAccountability)
      .filter(x => x?.SectionName == section.Name ?? this.applicationService.model.BuildingName!)
      .flatMap(x => x?.Accountability);
    let notAllocatedAreas: string[] = this.areasOfAccountability.filter(x => !accountabilityAreasOfSection.includes(x))
    return notAllocatedAreas;
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
