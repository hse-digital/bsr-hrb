import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlockRegistrationService, BlockRegistrationModel } from 'src/app/services/block-registration.service';

@Component({
  selector: 'hse-check-answers',
  templateUrl: './check-answers.component.html',
})
export class CheckAnswersComponent {

  nextScreenRoute: string = '';

  URLs = {
    floorsAbove: "/building-registration/building/floors-above",
    height: "/building-registration/building/height",
    residentialUnits: "/building-registration/building/residential-units",
    peopleLivingInBuilding: "/building-registration/building/people-living-in-building",
    yearCompletition: "/building-registration/building/check-answers", // TO-DO
    completitionCertificateIssuer: "/building-registration/building/check-answers", // TO-DO
    completitionCertificateReference: "/building-registration/building/check-answers", // TO-DO
    address: "/building-registration/building/check-answers" // TO-DO
  }

  constructor(private router: Router, private blockRegistrationService: BlockRegistrationService) { }

  get block(): BlockRegistrationModel | undefined {
    return this.blockRegistrationService.blockRegistrationModel;
  }

  saveAndContinue() {
    this.router.navigate([this.nextScreenRoute]);
  }

}
