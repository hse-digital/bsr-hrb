import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-check-answers',
  templateUrl: './check-answers.component.html',
})
export class CheckAnswersComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'check-answers';
  URLs = {
    floorsAbove: "floors-above",
    height: "height",
    residentialUnits: "residential-units",
    peopleLivingInBuilding: "people-living-in-building",
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
    return navigationService.navigate('/application/accountable-person');
  }

  get block(): any {
    return this.applicationService.currentBlock;
  }

  onSummaryRowClick(event: any, link: string) {
    event.preventDefault();
    this.navigationService.navigateRelative(link, this.activatedRoute);
  }
}
