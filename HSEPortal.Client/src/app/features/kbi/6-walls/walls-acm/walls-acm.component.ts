import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { WallsHplComponent } from '../walls-hpl/walls-hpl.component';
import { EstimatedPercentageComponent } from '../estimated-percentage/estimated-percentage.component';

@Component({
  selector: 'hse-walls-acm',
  templateUrl: './walls-acm.component.html'
})
export class WallsAcmComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'acm';
  static title: string = "ACM on outside walls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  
  errorMessage?: string;
  wallsAcmHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.errorMessage = `Select whether the aluminium composite material (ACM) meets the fire classification A2-s1, d0 or better, has passed a large-scale fire test to BS8414, or neither of these`;
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentKbiSection!.StructureName;
  }

  canContinue(): boolean {
    this.wallsAcmHasErrors = !this.applicationService.currentKbiSection!.Walls.WallACM;
    return !this.wallsAcmHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.doesExternalWallMaterialsIncludes('hpl')) {
      return navigationService.navigateRelative(WallsHplComponent.route, activatedRoute);
    }
    return navigationService.navigateRelative(EstimatedPercentageComponent.route, activatedRoute);
  }

  doesExternalWallMaterialsIncludes(material: string) {
    return this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.includes(material);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials 
      && this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.length > 0 
      && this.applicationService.currentKbiSection!.Walls.ExternalWallMaterials!.includes('acm');
  }

}
