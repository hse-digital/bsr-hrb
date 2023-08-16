import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ChangePrimaryUseComponent } from '../change-primary-use/change-primary-use.component';
import { UndergoneBuildingMaterialChangesComponent } from '../undergone-building-material-changes/undergone-building-material-changes.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-primary-use-building-below-ground-level',
  templateUrl: './primary-use-building-below-ground-level.component.html'
})
export class PrimaryUseBuildingBelowGroundLevelComponent extends PageComponent<string> {
  static route: string = 'primary-use-floors-below-ground-level';
  static title: string = "Primary use of floors below ground level - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  primaryUseBuildingBelowGroundLevelHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.errorMessage = `Select the primary use of the floors below ground level in ${this.getInfraestructureName()}`;
    this.model = applicationService.currentKbiSection!.BuildingUse.PrimaryUseBuildingBelowGroundLevel;
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.PrimaryUseBuildingBelowGroundLevel = this.model;
  }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.BuildingUse.FloorsBelowGroundLevel && this.applicationService.currentKbiSection?.BuildingUse.FloorsBelowGroundLevel > 0;
  }
  
  override isValid(): boolean {
    this.primaryUseBuildingBelowGroundLevelHasErrors = !this.model || this.model.length == 0;
    return !this.primaryUseBuildingBelowGroundLevelHasErrors;
  }
  
  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding == "residential_dwellings") {
      return this.navigationService.navigateRelative(ChangePrimaryUseComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(UndergoneBuildingMaterialChangesComponent.route, this.activatedRoute);
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
