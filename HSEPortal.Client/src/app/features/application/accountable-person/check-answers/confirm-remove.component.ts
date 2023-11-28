import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AccountablePersonModel, ApplicationService } from "src/app/services/application.service";

@Component({
  templateUrl: './confirm-remove.component.html',
  selector: 'confirm-remove'
})
export class ConfirmRemoveComponent {
  @Input() ap!: AccountablePersonModel;
  @Output() onConfirm = new EventEmitter<boolean>();

  model?: boolean;
  error = false;

  constructor(private applicationService: ApplicationService) { }

  getApNameDescription(): string {
    return `Are you sture you want to remove ${this.getApName()}?`;
  }

  getApName() {
    return this.ap.Type == 'organisation' ? this.ap.OrganisationName :
      `${this.ap.FirstName ?? this.applicationService.model.ContactFirstName} ${this.ap.LastName ?? this.applicationService.model.ContactLastName}`;
  }

  emit() {
    this.error = false;

    if (this.model == undefined) {
      this.error = true;
    } else {
      this.onConfirm.emit(this.model);
    }
  }

  getErrorDescription() {
    if (this.error) {
      return `Select yes, to confirm you want to remove ${this.getApName()} as an accountable person`;
    }

    return undefined;
  }
}