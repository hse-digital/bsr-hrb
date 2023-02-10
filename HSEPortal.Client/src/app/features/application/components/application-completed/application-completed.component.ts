import { Component } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-application-completed',
  templateUrl: './application-completed.component.html'
})
export class ApplicationCompletedComponent {

  constructor(private buildingRegistrationService: ApplicationService) {
    
  }

  get email(): string | undefined {
    return this.buildingRegistrationService.model.ContactEmailAddress ?? "[email]";
  }

  get buildingName(): string | undefined {
    return this.buildingRegistrationService.model.BuildingName ?? "[building name]";
  }
}
