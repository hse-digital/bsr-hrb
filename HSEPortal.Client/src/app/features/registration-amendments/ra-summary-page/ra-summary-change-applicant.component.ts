import { Component, Input } from "@angular/core";
import { Change } from "src/app/services/registration-amendments.service";

@Component({
    selector: 'ra-summary-change-applicant',
    templateUrl: './ra-summary-change-applicant.component.html',
    styles: ['.govuk-summary-list__key { width:20%!important; }']
})
export class RaSummaryChangeApplicantComponent {

    @Input() public applicantChanges!: Change[];
    @Input() public papChanges!: Change[];

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

    get principalAccountablePerson() {
      return this.papChanges.find(x => x.FieldName == "Principal accountable person");
    }

    get papDetails() {
      return this.papChanges.filter(x => x.FieldName != "Principal accountable person" && x.FieldName?.startsWith("Principal"));
    }

    get areasOfAccountability() {
      return this.papChanges.filter(x => x.FieldName?.startsWith("Routes") || x.FieldName?.startsWith("Maintaining") || x.FieldName?.startsWith("Facilities"));
    }

}