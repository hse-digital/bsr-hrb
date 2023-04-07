import { Component, Input, OnInit } from "@angular/core";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { AccountablePersonModel, ApplicationService } from "src/app/services/application.service";

@Component({
  selector: 'pap-accountability',
  templateUrl: 'pap-accountability.component.html'
})
export class PapAccountabilityComponent implements OnInit {

  @Input() area!: AccountabilityArea;
  @Input() pap!: AccountablePersonModel;

  papName?: string;
  accountabilityArea = AccountabilityArea;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    if (this.pap.Type == 'organisation' && FieldValidations.IsNotNullOrWhitespace(this.pap.OrganisationName)) {
      this.papName = this.pap.OrganisationName;
    } else {
      if (this.pap.IsPrincipal == 'yes' && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactFirstName) && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactLastName)) {
        this.papName = `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
      } else if (FieldValidations.IsNotNullOrWhitespace(this.pap.FirstName) && FieldValidations.IsNotNullOrWhitespace(this.pap.LastName)) {
        this.papName = `${this.pap.FirstName} ${this.pap.LastName}`;
      }
    }
  }
}

export enum AccountabilityArea {
  CheckAnswers, Summary
}
