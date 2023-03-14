import { Component } from "@angular/core";
import { ApplicationService } from "../services/application.service";
import { NavigationService } from "../services/navigation.service";

@Component({
  selector: 'save-and-come-back',
  template: `<govuk-body><a (keyup.enter)="saveAndComeBack()" (click)="saveAndComeBack()" class="govuk-link" role="link" tabindex="0">Save and come back later</a></govuk-body>`
})
export class SaveAndComeBackLaterComponent {
  constructor(private applicationService: ApplicationService, private navigationService: NavigationService) {}

  async saveAndComeBack() {
    await this.applicationService.updateApplication();
    this.navigationService.navigate(`application/${this.applicationService.model.id}`);
  }
}
