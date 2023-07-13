import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, KeyValueHelper } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ResidentialUnitFrontDoorsFireResistanceComponent } from '../residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

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
    let keyValueHelper = new KeyValueHelper<string, string[]>(this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions);
    let thereAreProvisions = this.areThereProvisions();
    let fireSmokeProvisionIsNone = this.isFireSmokeProvisionNone(keyValueHelper);
    let thereAreProvisionsWithLocation = this.areThereProvisionsWithLocation(keyValueHelper);
    let thereAreOnlyProvisionsWithoutLocation = this.areThereOnlyProvisionsWithoutLocation(keyValueHelper);
    return thereAreProvisions && (fireSmokeProvisionIsNone || thereAreProvisionsWithLocation || thereAreOnlyProvisionsWithoutLocation);
  }

  private areThereProvisions() {
    return !!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions && this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions.length > 0;
  }

  private isFireSmokeProvisionNone(keyValueHelper: KeyValueHelper<string, string[]>) {
    return !!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions && this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions?.length == 1 && keyValueHelper.getKeys()[0] == 'none';
  }

  private areThereProvisionsWithLocation(keyValueHelper: KeyValueHelper<string, string[]>) {
    let filteredProvisions = this.getFilteredProvisions(keyValueHelper);
    if (FieldValidations.IsNotNullOrEmpty(filteredProvisions)) {
      let locationsExist = !!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions && keyValueHelper.KeyValue.length > 0;
      let everyProvisionHasALocation = locationsExist && keyValueHelper.KeyValue.filter(x => filteredProvisions.indexOf(x.key) > -1 ).every(x => !!x.value && x.value.length > 0);
      return everyProvisionHasALocation;
    }
    return false;
  }

  private areThereOnlyProvisionsWithoutLocation(keyValueHelper: KeyValueHelper<string, string[]>) {
    let filteredProvisions = this.getFilteredProvisions(keyValueHelper);
    return !!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions && this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions?.length > 0 && filteredProvisions?.length == 0
  }

  private getFilteredProvisions(keyValueHelper: KeyValueHelper<string, string[]>) {
    let provisionsWithLocation: string[] = ["alarm_heat_smoke", "alarm_call_points", "fire_dampers", "fire_shutters", "heat_detectors", "smoke_aovs", "smoke_manual", "smoke_detectors", "sprinklers_misters"];
    return keyValueHelper.getKeys()?.filter(x => provisionsWithLocation.indexOf(x) > -1);
  }

}
