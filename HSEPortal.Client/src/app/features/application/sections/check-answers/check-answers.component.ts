import { Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService, BuildingApplicationStatus, SectionModel } from 'src/app/services/application.service';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { NavigationService } from 'src/app/services/navigation.service';
import { SectionFloorsAboveComponent } from '../floors-above/floors-above.component';
import { SectionHeightComponent } from '../height/height.component';
import { SectionResidentialUnitsComponent } from '../residential-units/residential-units.component';
import { SectionPeopleLivingInBuildingComponent } from '../people-living-in-building/people-living-in-building.component';
import { MoreInformationComponent } from '../more-information/more-information.component';
import { SectionAddressComponent } from '../address/address.component';
import { NumberOfSectionsComponment } from '../../number-of-sections/number-of-sections.component';
import { BuildingOutOfScopeComponent } from '../../out-of-scope/out-of-scope.component';
import { AccountablePersonComponent } from '../../accountable-person/accountable-person/accountable-person.component';
import { AccountablePersonModule } from '../../accountable-person/accountable-person.module';
import { SectionHelper } from 'src/app/helpers/section-name-helper';
import { SectionYearOfCompletionComponent } from '../year-of-completion/year-of-completion.component';
import { GovukErrorSummaryComponent } from 'hse-angular';

@Component({
  selector: 'hse-check-answers',
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers';

  URLs = {
    floorsAbove: SectionFloorsAboveComponent.route,
    height: SectionHeightComponent.route,
    residentialUnits: SectionResidentialUnitsComponent.route,
    peopleLivingInBuilding: SectionPeopleLivingInBuildingComponent.route,
    yearCompletition: SectionYearOfCompletionComponent.route, // TO-DO
    completitionCertificateIssuer: "check-answers", // TO-DO
    completitionCertificateReference: "check-answers", // TO-DO
    address: SectionAddressComponent.route // TO-DO
  }

  sections: SectionModel[] = [];

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  async ngOnInit() {
    this.sections = this.applicationService.model.Sections;
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    var sectionsOutOfScope = this.getOutOfScopeSections();
    if (sectionsOutOfScope.length == this.applicationService.model.Sections.length) {
      // all blocks out of scope
      return navigationService.navigateRelative(`../${BuildingOutOfScopeComponent.route}`, activatedRoute);
    }

    if (sectionsOutOfScope.length > 0) {
      // some blocks out of scope
      return navigationService.navigateRelative(MoreInformationComponent.route, activatedRoute);
    }

    return navigationService.navigateRelative(`../${AccountablePersonModule.baseRoute}/${AccountablePersonComponent.route}`, activatedRoute);
  }

  navigateToMultipleSections() {
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { return: 'sections/check-answers' });
  }

  getSectionName(sectionIndex: number, section?: SectionModel) {
    return section?.Name ?? `${this.getBlockIndex(sectionIndex + 1)} section`;
  }

  getBlockIndex(index: number) {
    switch (index) {
      case 1: return 'First';
      case 2: return 'Second';
      case 3: return 'Third';
      case 4: return 'Fourth';
      case 5: return 'Fifth';
    }

    return "Last";
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStatus.BlocksInBuildingComplete;
  }

  private getOutOfScopeSections() {
    return this.applicationService.model.Sections.filter(section => SectionHelper.isOutOfScope(section));
  }
}
