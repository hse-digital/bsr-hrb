import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { PreviousUseBuildingComponent } from '../previous-use-building/previous-use-building.component';
import { UndergoneBuildingMaterialChangesComponent } from '../undergone-building-material-changes/undergone-building-material-changes.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-change-primary-use',
  templateUrl: './change-primary-use.component.html'
})
export class ChangePrimaryUseComponent  extends PageComponent<string> {
  static route: string = 'change-primary-use';
  static title: string = "Change in primary use - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  changePrimaryUseHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.errorMessage = `Select whether ${this.getInfraestructureName()} has had a different primary use in the past`;
    this.model = this.applicationService.currentKbiSection?.BuildingUse.ChangePrimaryUse;
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.ChangePrimaryUse = this.model;
  }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.BuildingUse.FloorsBelowGroundLevel;
  }
  
  override isValid(): boolean {
    this.changePrimaryUseHasErrors = !this.model || this.model?.length == 0;
    return !this.changePrimaryUseHasErrors;
  }
  
  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentKbiSection?.BuildingUse.ChangePrimaryUse === "yes") {
      return this.navigationService.navigateRelative(PreviousUseBuildingComponent.route, this.activatedRoute);  
    }

    return this.navigationService.navigateRelative(UndergoneBuildingMaterialChangesComponent.route, this.activatedRoute);
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentKbiSection!.StructureName;
  }

}
