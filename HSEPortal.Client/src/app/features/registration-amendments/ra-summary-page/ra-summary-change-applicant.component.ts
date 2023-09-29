import { Component, Input } from "@angular/core";
import { Change } from "src/app/services/registration-amendments.service";

@Component({
    selector: 'ra-summary-change-applicant',
    templateUrl: './ra-summary-change-applicant.component.html',
    styles: ['.govuk-summary-list__key { width:20%!important; }']
})
export class RaSummaryChangeApplicantComponent {

    @Input() public changes!: Change[];

    constructor(){ }

    getFullName(answer: string) {
      return answer.split('-')[0].trim();
    }
    
    getEmailAddress(answer: string) {
      return answer.split('-')[1].trim();
    }
  
    getPhoneNumber(answer: string) {
      return answer.split('-')[2].trim();
    }
}