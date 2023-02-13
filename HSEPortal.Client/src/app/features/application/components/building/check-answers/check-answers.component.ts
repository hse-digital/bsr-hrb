import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';

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

  constructor(private router: Router,  private applicationService: ApplicationService) { }

  get block(): any | undefined {
    return this.applicationService.currentBlock;
  }

  saveAndContinue() {
    this.router.navigate([this.nextScreenRoute]);
  }

}
