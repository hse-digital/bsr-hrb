import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { EstimatedPercentageComponent } from '../estimated-percentage/estimated-percentage.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-walls-hpl',
  templateUrl: './walls-hpl.component.html'
})
export class WallsHplComponent extends PageComponent<string> {
  static route: string = 'hpl';
  static title: string = "HPL on outside walls - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  wallsHplHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentKbiSection!.Walls.WallHPL;
    this.errorMessage = `Select whether the high pressure laminate (HPL) meets the fire classification A2-s1, d0 or better, has passed a large-scale fire test to BS8414, or neither of these'`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Walls.WallHPL = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let canAccess: boolean = !!this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials
      && this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.length > 0
      && this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.includes('hpl');
    if (this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.includes('acm')) {
      canAccess &&= !!this.applicationService.currentKbiSection?.Walls.WallACM;
    }
    return canAccess;
  }

  override isValid(): boolean {
    this.wallsHplHasErrors = !this.model;
    return !this.wallsHplHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(EstimatedPercentageComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
