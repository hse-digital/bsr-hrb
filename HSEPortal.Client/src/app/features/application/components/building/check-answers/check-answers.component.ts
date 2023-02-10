import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService, BuildingRegistrationModel } from '../../../../../services/application.service';

@Component({
  selector: 'hse-check-answers',
  templateUrl: './check-answers.component.html',
})
export class CheckAnswersComponent {

  nextScreenRoute: string = '/application/accountable-person';

  URLs = {
    floorsAbove: "../floors-above",
    height: "../height",
    residentialUnits: "../residential-units",
    peopleLivingInBuilding: "../people-living-in-building",
    yearCompletition: "../check-answers", // TO-DO
    completitionCertificateIssuer: "../check-answers", // TO-DO
    completitionCertificateReference: "../check-answers", // TO-DO
    address: "../check-answers" // TO-DO
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private applicationService: ApplicationService) { }

  get block(): any | undefined {
    let blockId = this.activatedRoute.snapshot.params['blockId'];
    return this.applicationService.model.Blocks?.find(x => x.Id === blockId);
  }

  saveAndContinue() {
    this.router.navigate([this.nextScreenRoute]);
  }

  getLink(child: string) {
    return this.activatedRoute.parent?.url + child;
  }

}
