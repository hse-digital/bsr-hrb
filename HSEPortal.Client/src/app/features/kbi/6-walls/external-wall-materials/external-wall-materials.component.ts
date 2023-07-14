import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent, GovukCheckboxComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, KeyValue, KeyValueHelper } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { WallsAcmComponent } from '../walls-acm/walls-acm.component';
import { WallsHplComponent } from '../walls-hpl/walls-hpl.component';
import { EstimatedPercentageComponent } from '../estimated-percentage/estimated-percentage.component';

@Component({
  selector: 'hse-external-wall-materials',
  templateUrl: './external-wall-materials.component.html'
})
export class ExternalWallMaterialsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'external-materials';
  static title: string = "Materials on outside wall - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  externalWallMaterialsHasErrors = false;

  keyValueHelper?: KeyValueHelper<string, number>;
  model: string[] = []

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if(!this.applicationService.currentKbiSection?.Walls) this.applicationService.currentKbiSection!.Walls = {}
    if (!this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials) { 
      this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials = [];
    }
    this.keyValueHelper = new KeyValueHelper<string, number>(this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials);
    this.model = this.keyValueHelper.getKeys() ?? [];
    this.errorMessage = `Select what materials are visible on the outside of the walls of ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  canContinue(): boolean {
    this.externalWallMaterialsHasErrors = !this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials || this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials.length == 0;

    if (this.externalWallMaterialsHasErrors) this.firstCheckboxAnchorId = `acm-${this.checkboxes?.first.innerId}`;
    else {
      if (this.keyValueHelper!.getKeys().findIndex(x => x == 'glass') == -1) {
        this.keyValueHelper?.KeyValue.push({key: 'glass', value: undefined});
      }   
      this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials = this.keyValueHelper?.KeyValue;
    } 


    return !this.externalWallMaterialsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.doesExternalWallMaterialsIncludes('acm')) {
      return navigationService.navigateRelative(WallsAcmComponent.route, activatedRoute);
    } else if (this.doesExternalWallMaterialsIncludes('hpl')) {
      return navigationService.navigateRelative(WallsHplComponent.route, activatedRoute);
    }
    return navigationService.navigateRelative(EstimatedPercentageComponent.route, activatedRoute);
  }

  doesExternalWallMaterialsIncludes(material: string) {
    return this.keyValueHelper?.getKeys()!.includes(material);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Staircases.TotalNumberStaircases
      && !!this.applicationService.currentKbiSection?.Staircases.InternalStaircasesAllFloors;
  }

}
