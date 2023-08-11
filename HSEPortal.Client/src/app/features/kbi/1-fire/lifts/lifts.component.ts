import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ResidentialUnitFrontDoorsFireResistanceComponent } from '../residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component';

@Component({
  selector: 'hse-lifts',
  templateUrl: './lifts.component.html'
})
export class LiftsComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'lifts';
  static title: string = "Types of lift - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  liftsHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currentKbiSection!.Fire.Lifts) { this.applicationService.currentKbiSection!.Fire.Lifts = []; }
    this.errorMessage = `Select the types of lift in ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  canContinue(): boolean {
    this.liftsHasErrors = !this.applicationService.currentKbiSection!.Fire.Lifts 
      || this.applicationService.currentKbiSection!.Fire.Lifts.length == 0;

    if (this.liftsHasErrors) this.firstCheckboxAnchorId = `evacuation-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.liftsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(ResidentialUnitFrontDoorsFireResistanceComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    let provisions = this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions;
    let provisionsWithLocations = this.getProvisionsWithLocation();
    let locations = this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations 

    if(this.isNone(provisions)) return true;
    
    if(!provisions || provisions.length == 0) return false;

    return !provisionsWithLocations || provisionsWithLocations.length == 0 || (!!locations && Object.keys(locations).length > 0 && Object.values(locations).every(x => x.length > 0));  
  }

  private isNone(provisions?: string[]) {
    return !!provisions && provisions?.length == 1 && provisions![0] == 'none';
  }

  private provisionsWithoutLocation = ["risers_dry", "risers_wet", "fire_extinguishers"]
  getProvisionsWithLocation() {
    return this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions?.filter(x => !this.provisionsWithoutLocation.includes(x));
  }
}
