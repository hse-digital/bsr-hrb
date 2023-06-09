import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukCheckboxComponent, GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { BuildingStructureTypeComponent } from '../../3-structure/building-structure-type/building-structure-type.component';
import { KbiStructureModule } from '../../3-structure/kbi.structure.module';
import { KbiService } from 'src/app/services/kbi.service';

@Component({
  selector: 'hse-energy-supply',
  templateUrl: './energy-supply.component.html'
})
export class EnergySupplyComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'supply';
  static title: string = "Energy supplies to - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  energySupplyHasErrors = false;
  firstCheckboxAnchorId?: string;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, private kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currentKbiSection!.Energy.EnergySupply) { this.applicationService.currentKbiSection!.Energy.EnergySupply = []; }
    this.errorMessage = `Select the types of energy supply in ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.energySupplyHasErrors = !this.applicationService.currentKbiSection!.Energy.EnergySupply
      || this.applicationService.currentKbiSection!.Energy.EnergySupply.length == 0;
      
      if (this.energySupplyHasErrors) this.firstCheckboxAnchorId = `communal-${this.checkboxes?.first.innerId}`;

    return !this.energySupplyHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(`../${KbiStructureModule.baseRoute}/${BuildingStructureTypeComponent.route}`, activatedRoute);
  }

  override async onSave(): Promise<void> {
    var sectionModel = this.applicationService.currentKbiSection;
    await this.kbiService.syncFireEnergy(sectionModel);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Energy.OnsiteEnergyGeneration
      && this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration.length > 0;
  }
}
