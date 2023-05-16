import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent, GovukCheckboxComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-external-wall-materials',
  templateUrl: './external-wall-materials.component.html',
  styleUrls: ['./external-wall-materials.component.scss']
})
export class ExternalWallMaterialsComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = '';
  static title: string = " - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;
  errorMessage?: string;

  firstCheckboxAnchorId?: string;
  externalWallMaterialsHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.externalWallMaterials) { this.applicationService.currenKbiSection!.externalWallMaterials = []; }
    this.errorMessage = `${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.firstCheckboxAnchorId = `acm-${this.checkboxes?.first.innerId}`;
    this.externalWallMaterialsHasErrors = !this.applicationService.currenKbiSection!.externalWallMaterials || this.applicationService.currenKbiSection!.externalWallMaterials.length == 0;
    if(this.externalWallMaterialsHasErrors) this.errorMessage = `${this.getInfraestructureName()}`;
    return !this.externalWallMaterialsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    
    return navigationService.navigateRelative(ExternalWallMaterialsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }

}
