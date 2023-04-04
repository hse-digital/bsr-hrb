import { Component, Input, OnInit } from "@angular/core";
import { AccountablePersonModel, ApplicationService } from "src/app/services/application.service";

@Component({
  selector: 'pap-accountability',
  templateUrl: 'pap-accountability.component.html'
})
export class PapAccountabilityComponent implements OnInit {

  @Input() area!: AccountabilityArea;
  @Input() pap!: AccountablePersonModel;

  papName?: string;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    if (this.pap.Type == 'organisation' && !!this.pap.OrganisationName) {
      this.papName = this.pap.OrganisationName;
    } else {
      if (this.pap.IsPrincipal == 'yes' && !!this.applicationService.model.ContactFirstName && !!this.applicationService.model.ContactLastName) {
        this.papName = `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
      } else if (!!this.pap.FirstName && !!this.pap.LastName) {
        this.papName = `${this.pap.FirstName} ${this.pap.LastName}`;
      }
    }
  }

  isCheckAnswers() {
    return this.area == AccountabilityArea.CheckAnswers;
  }

  isSummary() {
    return this.area == AccountabilityArea.Summary;
  }

}

export enum AccountabilityArea {
  CheckAnswers, Summary
}
