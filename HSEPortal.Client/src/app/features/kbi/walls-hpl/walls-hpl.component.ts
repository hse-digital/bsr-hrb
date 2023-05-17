import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-walls-hpl',
  templateUrl: './walls-hpl.component.html'
})
export class WallsHplComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'hpl';
  static title: string = "HPL on outside walls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  
  errorMessage?: string;
  wallsHplHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.errorMessage = `Select whether the high pressure laminate (HPL) meets the fire classification A2-s1, d0 or better, has passed a large-scale fire test to BS8414, or neither of these'`;
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.wallsHplHasErrors = !this.applicationService.currenKbiSection!.WallHPL;
    return !this.wallsHplHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(WallsHplComponent.route, activatedRoute); // user goes to material percentage
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    let canAccess: boolean = !!this.applicationService.currenKbiSection?.ExternalWallMaterials 
                            && this.applicationService.currenKbiSection!.ExternalWallMaterials!.length > 0
                            && this.applicationService.currenKbiSection!.ExternalWallMaterials!.includes('hpl');
    if(this.applicationService.currenKbiSection!.ExternalWallMaterials!.includes('acm')) {
      canAccess &&= !!this.applicationService.currenKbiSection?.WallACM;
    } 
    return canAccess;
  }

}
