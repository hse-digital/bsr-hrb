import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { NavigationService } from 'src/app/services/navigation.service';
import { SectionFloorsAboveComponent } from '../floors-above/floors-above.component';
import { SectionHeightComponent } from '../height/height.component';
import { SectionResidentialUnitsComponent } from '../residential-units/residential-units.component';
import { SectionPeopleLivingInBuildingComponent } from '../people-living-in-building/people-living-in-building.component';
import { MoreInformationComponent } from '../more-information/more-information.component';
import { SectionAddressComponent } from '../address/address.component';

@Component({
  selector: 'hse-check-answers',
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss']
})
export class SectionCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers';

  URLs = {
    floorsAbove: SectionFloorsAboveComponent.route,
    height: SectionHeightComponent.route,
    residentialUnits: SectionResidentialUnitsComponent.route,
    peopleLivingInBuilding: SectionPeopleLivingInBuildingComponent.route,
    yearCompletition: "check-answers", // TO-DO
    completitionCertificateIssuer: "check-answers", // TO-DO
    completitionCertificateReference: "check-answers", // TO-DO
    address: SectionAddressComponent.route // TO-DO
  }

  sections: SectionModel[] = [];

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  ngOnInit(): void {
    this.sections = this.applicationService.model.Sections;
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(MoreInformationComponent.route, activatedRoute);
  }

  get section(): SectionModel {
    return this.applicationService.currentSection;
  }
  
  navigateTo(sectionIndex: number, url: string) {
    this.navigationService.navigateRelative(`section-${sectionIndex+1}/${url}`, this.activatedRoute, { return: 'check-answers' });
  }

  getSectionName(sectionIndex: number, section: SectionModel) {
    return section.Name ?? `${this.getBlockIndex(sectionIndex+1)} block`;
  }

  getBlockIndex(index: number) {
    switch(index) {
      case 1: return 'First';
      case 2: return 'Second';
      case 3: return 'Third';
      case 4: return 'Fourth';
      case 5: return 'Fifth';
    }

    return "Last";
  }
}
