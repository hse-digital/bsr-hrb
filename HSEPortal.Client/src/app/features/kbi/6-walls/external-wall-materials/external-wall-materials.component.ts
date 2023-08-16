import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxComponent } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';
import { WallsAcmComponent } from '../walls-acm/walls-acm.component';
import { WallsHplComponent } from '../walls-hpl/walls-hpl.component';
import { EstimatedPercentageComponent } from '../estimated-percentage/estimated-percentage.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-external-wall-materials',
  templateUrl: './external-wall-materials.component.html'
})
export class ExternalWallMaterialsComponent extends PageComponent<string[]> {
  static route: string = 'external-materials';
  static title: string = "Materials on outside wall - Register a high-rise building - GOV.UK";

  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  externalWallMaterialsHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if(!this.applicationService.currentKbiSection?.Walls) this.applicationService.currentKbiSection!.Walls = {}
    if (!this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials) { this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials = []; }
    this.errorMessage = `Select what materials are visible on the outside of the walls of ${this.getInfraestructureName()}`;
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials = CloneHelper.DeepCopy(this.model);
    if (!this.applicationService.currentKbiSection?.Walls.ExternalWallMaterialsPercentage || Object.keys(this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage).length == 0) {
      this.initExternalWallMaterialsPercentage();
    } else {
      this.mapExternalWallMaterials();
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Staircases.TotalNumberStaircases
      && !!this.applicationService.currentKbiSection?.Staircases.InternalStaircasesAllFloors;
  }

  override isValid(): boolean {
    this.externalWallMaterialsHasErrors = !this.model || this.model?.length == 0;

    if (this.externalWallMaterialsHasErrors) this.firstCheckboxAnchorId = `acm-${this.checkboxes?.first.innerId}`;
    else if (this.model!.indexOf('glass') == -1) this.model?.push('glass');

    return !this.externalWallMaterialsHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.doesExternalWallMaterialsIncludes('acm')) {
      return this.navigationService.navigateRelative(WallsAcmComponent.route, this.activatedRoute);
    } else if (this.doesExternalWallMaterialsIncludes('hpl')) {
      return this.navigationService.navigateRelative(WallsHplComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(EstimatedPercentageComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  private initExternalWallMaterialsPercentage() {
    this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage = {};
    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(material => {
      this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage![material] = '';
    });
  }

  private mapExternalWallMaterials() {
    let aux: Record<string, string> = {};
    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(x =>
      aux[x] = !!this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage![x]
        ? this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage![x]
        : ''
    );
    this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage = aux;
  }

  doesExternalWallMaterialsIncludes(material: string) {
    return this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.includes(material);
  }

}
