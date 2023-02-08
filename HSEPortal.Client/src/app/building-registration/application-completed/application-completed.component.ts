import { Component } from '@angular/core';
import { BuildingRegistrationService } from '../../services/building-registration/building-registration.service';

@Component({
  selector: 'hse-application-completed',
  templateUrl: './application-completed.component.html'
})
export class ApplicationCompletedComponent {

  constructor(private buildingRegistrationService: BuildingRegistrationService) {
    
  }

  get email(): string | undefined {
    return this.buildingRegistrationService.buildingRegistrationModel.ContactEmailAddress ?? "[email]";
  }

  get buildingName(): string | undefined {
    return this.buildingRegistrationService.buildingRegistrationModel.BuildingName ?? "[building name]";
  }
}
