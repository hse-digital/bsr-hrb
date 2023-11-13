import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { GovukCheckboxComponent } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'not-allocated-accountability',
  templateUrl: './not-allocated-accountability.component.html'
})
export class NotAllocatedAccountabilityComponent {

  @Output() onKeyupEnter = new EventEmitter();
  @Output() onModelChange = new EventEmitter();
  @Input() title?: string;
  @Input() hint?: string;
  @Input() id!: string;
  @Input() errorText?: string;

  @ViewChildren("checkbox") public checkboxElements?: QueryList<GovukCheckboxComponent>;

  model: string[] = []

  constructor(public applicationService: ApplicationService) {
  }

  get accountablePersons(): string[] {
    let persons = this.applicationService.currentVersion!.AccountablePersons!;
    let accountablePersonNames: string[] = [];
    for (let i: number = 0; i < persons.length; i++) {
      if (persons[i].Type == 'organisation') {
        accountablePersonNames.push(persons[i].OrganisationName ?? "");
      } else {
        accountablePersonNames.push(`${persons[i].FirstName ?? this.applicationService.model.ContactFirstName} ${persons[i].LastName ?? this.applicationService.model.ContactLastName}`);
      }
    }
    return accountablePersonNames;
  }

  modelChange(){
    this.onModelChange.emit(this.model);
  }

}
