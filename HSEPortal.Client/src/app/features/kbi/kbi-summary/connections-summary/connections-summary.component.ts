import { Component, Input, OnInit } from '@angular/core';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { ApplicationService, Connections } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'connections-summary',
  templateUrl: './connections-summary.component.html'
})
export class ConnectionsSummaryComponent extends KbiSummaryComponent {

  @Input() connections?: Connections = {};

  constructor(applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(applicationService, navigationService, activatedRoute);
  }

  hasOtherHighRiseBuildingConnections() {
    return this.applicationService.currentKbiModel?.Connections?.OtherHighRiseBuildingConnections === 'yes' ?? false;
  }

  hasOtherBuildingConnections() {
    return this.applicationService.currentKbiModel?.Connections?.OtherBuildingConnections === 'yes' ?? false;
  }

}
