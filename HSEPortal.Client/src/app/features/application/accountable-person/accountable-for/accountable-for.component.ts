import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { ApplicationService, SectionAccountability, SectionModel } from "src/app/services/application.service";
import { AddAccountablePersonComponent } from "../add-accountable-person/add-accountable-person.component";
import { OrganisationNamedContactComponent } from "../organisation/named-contact/named-contact.component";
import { PageComponent } from "src/app/helpers/page.component";
import { CloneHelper } from "src/app/helpers/array-helper";

@Component({
  templateUrl: './accountable-for.component.html'
})
export class ApAccountableForComponent extends PageComponent<SectionAccountability[]> {
  static route: string = 'accountable-for';
  static title: string = "What areas is the AP accountable for? - Register a high-rise building - GOV.UK";

  InScopeStructures?: SectionModel[];

  multi: boolean = false;
  anySelected = false;
  errorMessage?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }  

  override onInit(applicationService: ApplicationService): void {
    this.InScopeStructures = this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope);
    this.multi = this.applicationService.model.NumberOfSections != 'one';
    this.errorMessage = `Select what ${this.getApName()} is accountable for`;

    if (!this.applicationService.currentAccountablePerson.SectionsAccountability) {
      this.applicationService.currentAccountablePerson.SectionsAccountability = [];
    }

    this.model = CloneHelper.DeepCopy(this.applicationService.currentAccountablePerson.SectionsAccountability) as SectionAccountability[];

    for (let i = 0; i < this.InScopeStructures!.length; i++) {
      var section = this.InScopeStructures![i];
      if (!this.model[i]) {
        this.model[i] = { SectionName: section.Name ?? this.applicationService.model.BuildingName!, Accountability: [] };
      }
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.SectionsAccountability = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    for (let i = 0; i < this.InScopeStructures!.length; i++) {
      var sectionAccountability = this.model![i];
      if (sectionAccountability.Accountability!.length > 0)
        return true;
    }

    return false;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentAccountablePerson.Type == 'individual') {
      return this.navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(OrganisationNamedContactComponent.route, this.activatedRoute);
  }

  getTitle() {
    return this.multi ?
      `Which areas of ${this.applicationService.model.BuildingName} is ${this.getApName()} accountable for?` :
      `What is ${this.getApName()} accountable for?`
  }

  getApName() {
    return this.applicationService.currentAccountablePerson.Type == 'organisation' ?
      this.applicationService.currentAccountablePerson.OrganisationName :
      `${this.applicationService.currentAccountablePerson.FirstName} ${this.applicationService.currentAccountablePerson.LastName}`;
  }

  getSectionError(sectionIndex: number) {
    var sectionAccountability = this.applicationService.currentAccountablePerson.SectionsAccountability![sectionIndex];
    if (!sectionAccountability || sectionAccountability.Accountability?.length == 0) {
      return this.getErrorDescription(true, this.errorMessage!);
    }

    return this.getErrorDescription(false, '');
  }

  getCheckboxTitle(section: any) {
    return this.applicationService.model.NumberOfSections == 'two_or_more' ? section?.Name ?? "First section" : this.applicationService.model.BuildingName;
  }
}
