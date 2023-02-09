import { Component } from '@angular/core';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  selector: 'hse-application-completed',
  templateUrl: './application-completed.component.html'
})
export class ApplicationCompletedComponent {

  constructor(private buildingRegistrationService: BuildingRegistrationService) {
    
  }

  get email(): string | undefined {
    return this.buildingRegistrationService.model.ContactEmailAddress ?? "[email]";
  }

  get buildingName(): string | undefined {
    return this.buildingRegistrationService.model.BuildingName ?? "[building name]";
  }
}
