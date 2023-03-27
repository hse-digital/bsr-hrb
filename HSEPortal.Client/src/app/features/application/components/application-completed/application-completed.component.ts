import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-application-completed',
  templateUrl: './application-completed.component.html'
})
export class ApplicationCompletedComponent {

  constructor(private buildingRegistrationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
    
  }

  get email(): string | undefined {
    return this.buildingRegistrationService.model.ContactEmailAddress ?? "[email]";
  }

  get buildingName(): string | undefined {
    return this.buildingRegistrationService.model.BuildingName ?? "[building name]";
  }

  navigateToSummary() {
    return this.navigationService.navigateRelative('../summary', this.activatedRoute);
  }
}
