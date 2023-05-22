import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-external-features',
  templateUrl: './external-features.component.html'
})
export class ExternalFeaturesComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'external-features';
  static title: string = "Features on outside walls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  externalFeaturesHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {

    if (!this.applicationService.currenKbiSection!.externalFeatures) { this.applicationService.currenKbiSection!.externalFeatures = []; }
    this.errorMessage = `Select the features on ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {

    this.externalFeaturesHasErrors = !this.applicationService.currenKbiSection!.externalFeatures
      || this.applicationService.currenKbiSection!.externalFeatures.length == 0;

    if (this.externalFeaturesHasErrors) this.firstCheckboxAnchorId = `advertising-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;


    return this.applicationService.currenKbiSection!.externalFeatures!.length > 0 ;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {

    //Check for navigation to features-materials
    const checkSelection = ['balconies', 'communal_walkway', 'escape_route_roof', 'machinery_outbuilding', 'machinery_roof_room', 'roof_lights', 'solar_shading'].every(option => {
      if (this.applicationService.currenKbiSection!.externalFeatures?.includes(option)) {
        console.log("Navigate to features-materials");
        return navigationService.navigateRelative(ExternalFeaturesComponent.route, activatedRoute);
      }
      else {
        return navigationService.navigateRelative(ExternalFeaturesComponent.route, activatedRoute);
      }
      //TODO update both routes when next pages available
    });

    return navigationService.navigateRelative(ExternalFeaturesComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {

    return !!this.applicationService.currenKbiSection?.externalWallInsulation?.checkBoxSelection && (this.applicationService.currenKbiSection!.externalWallInsulation?.checkBoxSelection![0] == 'none' || !!(this.applicationService.currenKbiSection!.externalWallInsulationPercentages));
  }
}
