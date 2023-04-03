import { Component, Input, OnInit } from "@angular/core";
import { AccountablePersonModel, ApplicationService } from "src/app/services/application.service";

@Component({
  selector: 'pap-accountability',
  templateUrl: 'pap-accountability.component.html'
})
export class PapAccountabilityComponent implements OnInit {

  papName?: string;
  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    if (this.pap.Type == 'organisation') {
      this.papName = this.pap.OrganisationName;
    } else {
      if (this.pap.IsPrincipal == 'yes') {
        this.papName = `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
      } else {
        this.papName = `${this.pap.FirstName} ${this.pap.LastName}`;
      }
    }
  }

  @Input() pap!: AccountablePersonModel;

}