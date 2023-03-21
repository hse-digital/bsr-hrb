import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { AddAccountablePersonComponent } from "../add-accountable-person/add-accountable-person.component";
import { OrganisationNamedContactComponent } from "../organisation/named-contact/named-contact.component";

@Component({
  templateUrl: './accountable-for.component.html'
})
export class ApAccountableForComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'accountable-for';
  static title: string = "What areas is the AP accountable for? - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  multi: boolean = false;
  anySelected = false;
  errorMessage?: string;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.multi = this.applicationService.model.NumberOfSections != 'one';
    this.errorMessage = `Select what ${this.getApName()} is accountable for`;

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
    for (let i = 0; i < this.applicationService.model.Sections.length; i++) {
      var sectionAccountability = this.applicationService.currentAccountablePerson.SectionsAccountability![i];
      if (sectionAccountability.Accountability!.length > 0)
        return true;
    }

    return false;
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

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currentAccountablePerson.Type == 'individual') {
      return navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, activatedRoute);
    }

    return navigationService.navigateRelative(OrganisationNamedContactComponent.route, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.Address || !!this.applicationService.currentAccountablePerson.PapAddress;
  }
}
