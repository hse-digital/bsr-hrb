import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { WallsHplComponent } from '../walls-hpl/walls-hpl.component';
import { EstimatedPercentageComponent } from '../estimated-percentage/estimated-percentage.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-walls-acm',
  templateUrl: './walls-acm.component.html'
})
export class WallsAcmComponent extends PageComponent<string> {
  static route: string = 'acm';
  static title: string = "ACM on outside walls - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  wallsAcmHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentKbiSection!.Walls.WallACM;
    this.errorMessage = `Select whether the aluminium composite material (ACM) meets the fire classification A2-s1, d0 or better, has passed a large-scale fire test to BS8414, or neither of these`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Walls.WallACM = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials 
      && this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.length > 0 
      && this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.includes('acm');
  }

  override isValid(): boolean {
    this.wallsAcmHasErrors = !this.model;
    return !this.wallsAcmHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.doesExternalWallMaterialsIncludes('hpl')) {
      return this.navigationService.navigateRelative(WallsHplComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(EstimatedPercentageComponent.route, this.activatedRoute);
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentKbiSection!.StructureName;
  }

  doesExternalWallMaterialsIncludes(material: string) {
    return this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.includes(material);
  }
}
