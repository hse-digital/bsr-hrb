import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, KeyValueHelper, KeyValue } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { FireSmokeProvisionLocationsComponent } from '../fire-smoke-provision-locations/fire-smoke-provision-locations.component';
import { LiftsComponent } from '../lifts/lifts.component';

@Component({
  selector: 'hse-fire-smoke-provisions',
  templateUrl: './fire-smoke-provisions.component.html'
})
export class FireSmokeProvisionsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'smoke-provisions';
  static title: string = "Common parts fire and smoke controls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  fireSmokeProvisionsHasErrors = false;

  private keyValueHelper?: KeyValueHelper<string, string[]>;
  model: string[] = [];

  private readonly provisionsWithLocation: string[] = ["alarm_heat_smoke", "alarm_call_points", "fire_dampers", "fire_shutters", "heat_detectors", "smoke_aovs", "smoke_manual", "smoke_detectors", "sprinklers_misters"];

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions) {
      this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions = [];
    }
    this.keyValueHelper = new KeyValueHelper<string, string[]>(this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions!);
    this.model = this.keyValueHelper.getKeys();
    this.errorMessage = `Select the fire and smoke control equipment in the residential common parts of ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  canContinue(): boolean {
     this.fireSmokeProvisionsHasErrors = !this.model || this.model.length == 0;

    if (this.fireSmokeProvisionsHasErrors) {
      this.firstCheckboxAnchorId = `alarm_heat_smoke-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    } else {
      this.keyValueHelper?.setKeys(this.model);
      this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions = [...this.keyValueHelper!.KeyValue];
    }

    return !this.fireSmokeProvisionsHasErrors;
  }
  
  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.keyValueHelper?.getKeys().some(x => this.provisionsWithLocation.indexOf(x) > -1)) {
      return navigationService.navigateRelative(FireSmokeProvisionLocationsComponent.route, activatedRoute, {
        equipment: this.keyValueHelper?.getKeys().find(x => this.provisionsWithLocation.indexOf(x) > -1)
      });
    }

    return navigationService.navigateRelative(LiftsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Fire.ProvisionsEquipment
      && this.applicationService.currentKbiSection!.Fire.ProvisionsEquipment.length > 0;
  }
}
