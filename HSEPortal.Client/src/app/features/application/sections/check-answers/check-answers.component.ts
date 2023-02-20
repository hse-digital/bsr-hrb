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
@Component({
  selector: 'hse-check-answers',
  templateUrl: './check-answers.component.html',
})
export class SectionCheckAnswersComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'check-answers';

  URLs = {
    floorsAbove: SectionFloorsAboveComponent.route,
    height: SectionHeightComponent.route,
    residentialUnits: SectionResidentialUnitsComponent.route,
    peopleLivingInBuilding: SectionPeopleLivingInBuildingComponent.route,
    yearCompletition: "check-answers", // TO-DO
    completitionCertificateIssuer: "check-answers", // TO-DO
    completitionCertificateReference: "check-answers", // TO-DO
    address: "check-answers" // TO-DO
  }

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('../add-more', activatedRoute);
  }

  get section(): SectionModel {
    return this.applicationService.currentSection;
  }
  
  navigateTo(url: string) {
    this.navigationService.navigateRelative(url, this.activatedRoute);
  }
}
