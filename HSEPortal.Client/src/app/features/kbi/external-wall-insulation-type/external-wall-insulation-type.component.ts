import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { json } from 'express';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneOtherComponent } from 'src/app/components/govuk-checkbox-none-other/govuk-checkbox-none-other.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ExternalFeaturesComponent } from '../external-features/external-features.component';
import { ExternalWallInsulationPercentageComponent } from '../external-wall-insulation-percentage/external-wall-insulation-percentage.component';

type Error = { hasError: boolean, errorMessage: string }

@Component({
  selector: 'hse-external-wall-insulation-type',
  templateUrl: './external-wall-insulation-type.component.html'
})
export class ExternalWallInsulationTypeComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'external-wall-insulation-type';
  static title: string = "Insulation in outside walls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneOtherComponent) externalWallInsulationTypeCheckboxGroup?: GovukCheckboxNoneOtherComponent;

  errorMessage?: string;
  externalWallInsulationTypeHasErrors: boolean = false;
  firstCheckboxAnchorId?: string;
  otherValueAnchorId?: string;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  errorMessages: Record<string, string> = {
    "noSelectionError": `Select what type of insulation is used in the outside walls of ${this.getInfraestructureName()}, or select \'None\'`,
    "noOtherValueError": `Enter the other insulation material used`,

  }

  defaultErrorMessage: string = `Select what type of insulation is used in the outside walls of ${this.getInfraestructureName()}, or select \'None\'`;
  errors = {
    noSelectionError: { hasError: false, errorMessage: "", } as Error,
    noOtherValueError: { hasError: false, errorMessage: "", } as Error
  };

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.externalWallInsulation) {
      this.applicationService.currenKbiSection!.externalWallInsulation! = {};
      this.applicationService.currenKbiSection!.externalWallInsulation!.checkBoxSelection = [];
      this.applicationService.currenKbiSection!.externalWallInsulation!.otherValue = '';
    }
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {


    if (this.applicationService!.currenKbiSection!.externalWallInsulation!.checkBoxSelection!.length == 0) {
      this.errors.noSelectionError.hasError = true;
      this.errors.noSelectionError.errorMessage = this.errorMessages["noSelectionError"];
      this.firstCheckboxAnchorId = `fibre_glass_mineral_wool-${this.externalWallInsulationTypeCheckboxGroup?.checkboxElements?.first.innerId}`;
    }
    else {
      this.errors.noSelectionError.hasError = false;
      this.errors.noSelectionError.errorMessage = '';
    }

    if ((this.applicationService.currenKbiSection!.externalWallInsulation!.checkBoxSelection!.includes('Other')
      && this.applicationService.currenKbiSection!.externalWallInsulation!.otherValue?.length == 0)) {
      this.errors.noOtherValueError.hasError = true;
      this.errors.noOtherValueError.errorMessage = this.errorMessages["noOtherValueError"];
      this.otherValueAnchorId = `input-other`;
    }
    else {
      this.errors.noOtherValueError.hasError = false;
      this.errors.noOtherValueError.errorMessage = '';
    }

    return !this.errors.noSelectionError.hasError
      && !this.errors.noOtherValueError.hasError
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if(this.applicationService.currenKbiSection!.externalWallInsulation!.checkBoxSelection!.includes('none'))
    {
      return navigationService.navigateRelative(ExternalFeaturesComponent.route, activatedRoute);
    }
    else {
      return navigationService.navigateRelative(ExternalWallInsulationPercentageComponent.route, activatedRoute);
    }
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }
}
