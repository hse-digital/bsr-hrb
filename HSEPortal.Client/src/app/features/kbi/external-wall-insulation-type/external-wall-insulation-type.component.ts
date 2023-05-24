import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ExternalFeaturesComponent } from '../external-features/external-features.component';
import { ExternalWallInsulationPercentageComponent } from '../external-wall-insulation-percentage/external-wall-insulation-percentage.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';

@Component({
  selector: 'hse-external-wall-insulation-type',
  templateUrl: './external-wall-insulation-type.component.html'
})
export class ExternalWallInsulationTypeComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'external-wall-insulation-type';
  static title: string = "Insulation in outside walls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) checkboxGroup?: GovukCheckboxNoneComponent;

  errorAnchorId?: string;
  errorMessage?: string;
  externalWallInsulationTypeHasErrors: boolean = false;
  otherError: boolean = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.ExternalWallInsulation) {
      this.applicationService.currenKbiSection!.ExternalWallInsulation = { CheckBoxSelection: [], OtherValue: '' };
    }
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.externalWallInsulationTypeHasErrors = false;
    this.validateCheckboxSelection();
    this.validateOtherOptionText();

    return !this.externalWallInsulationTypeHasErrors;
  }

  validateCheckboxSelection() {
    if (this.applicationService!.currenKbiSection!.ExternalWallInsulation!.CheckBoxSelection!.length == 0) {
      this.errorMessage = `Select what type of insulation is used in the outside walls of ${this.getInfraestructureName()}, or select \'None\'`;
      this.errorAnchorId = `fibre_glass_mineral_wool-${this.checkboxGroup?.checkboxElements?.first.innerId}`;
      this.externalWallInsulationTypeHasErrors = true;
    }
  }

  validateOtherOptionText() {
    if (this.applicationService.currenKbiSection!.ExternalWallInsulation!.CheckBoxSelection!.includes('other')
      && !FieldValidations.IsNotNullOrWhitespace(this.applicationService.currenKbiSection!.ExternalWallInsulation!.OtherValue)) {
      this.errorMessage = "Enter the other insulation material used";
      this.errorAnchorId = "input-other";
      this.externalWallInsulationTypeHasErrors = this.otherError = true;
    }
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currenKbiSection!.ExternalWallInsulation!.CheckBoxSelection!.includes('none')) {
      return navigationService.navigateRelative(ExternalFeaturesComponent.route, activatedRoute);
    }
    return navigationService.navigateRelative(ExternalWallInsulationPercentageComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }
}
