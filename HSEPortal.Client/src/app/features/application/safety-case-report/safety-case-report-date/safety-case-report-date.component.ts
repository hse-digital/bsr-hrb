import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, SafetyCaseReport } from 'src/app/services/application.service';
import { PageComponent } from 'src/app/helpers/page.component';
import { DateModel, IsDateInPast, isRealDate, isDayValid, isEmpty, isMonthValid, isYearLengthValid, isYearValid, isFull } from 'src/app/helpers/validators/date-validators';
import { SafetyCaseReportDeclarationComponent } from '../safety-case-report-declaration/safety-case-report-declaration.component';

@Component({
  templateUrl: './safety-case-report-date.component.html'
})
export class SafetyCaseReportDateComponent extends PageComponent<DateModel> {
  static route: string = "date";
  static title: string = "When was the safety case report last updated? - Register a high-rise building - GOV.UK";
  buildingName?: string;
  errorAnchorId?: string;
  modelValid: boolean = true;

  dayErrorMessage?: string;
  monthErrorMessage?: string;
  yearErrorMessage?: string;
  errorMessage?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.buildingName = this.applicationService.model.BuildingName;
    if (!this.applicationService.model.SafetyCaseReport) {
      this.applicationService.model.SafetyCaseReport = new SafetyCaseReport();
    }
    this.model = new DateModel(this.applicationService.model.SafetyCaseReport.date);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {

    const safetyCaseRportDate = this.model!.toAnsiDateString();

    if (this.applicationService.model.SafetyCaseReport!.date !== safetyCaseRportDate) {
      this.applicationService.model.SafetyCaseReport!.declaration = false;
    }
    this.applicationService.model.SafetyCaseReport!.date = safetyCaseRportDate;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !this.applicationService.model.SafetyCaseReport?.declaration;
  }

  override isValid(): boolean {
    this.modelValid = true;
    this.dayErrorMessage = this.monthErrorMessage = this.yearErrorMessage = this.errorAnchorId = undefined;

    const nothingEntered = isEmpty(this.model?.day, this.model?.month, this.model?.year);
    if (nothingEntered) {
      this.dayErrorMessage = 'Enter the date your safety case report was last updated. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-day';
      this.modelValid = false;
    }

    const allEntered = isFull(this.model?.day, this.model?.month, this.model?.year);
    if (!allEntered) {
      const dayValid = isDayValid(this.model?.day);
      if (!dayValid) {
        this.dayErrorMessage = 'The date your safety case report was last updated must be today or in the past. For example, 27 10 2023.';
        this.errorAnchorId = 'safety-case-report-date-day';
        this.modelValid = false;
      }

      const monthValid = isMonthValid(this.model?.month);
      if (!monthValid) {
        this.monthErrorMessage = 'The date your safety case report was last updated must contain a month and a year. For example, 27 10 2023.';
        this.errorAnchorId = this.errorAnchorId ?? 'safety-case-report-date-month';
        this.modelValid = false;
      }

      const yearValid = isYearValid(this.model?.year);
      if (!yearValid) {
        this.yearErrorMessage = 'The date your safety case report was last updated must contain a year. For example, 27 10 2023.';
        this.errorAnchorId = this.errorAnchorId ?? 'safety-case-report-date-year';
        this.modelValid = false;
      }

      const yearLengthValid = isYearLengthValid(this.model?.year);
      if (!yearLengthValid) {
        this.yearErrorMessage = 'The date your safety case report was last updated must contain a year. Year must include 4 numbers.';
        this.errorAnchorId = this.errorAnchorId ?? 'safety-case-report-date-year';
        this.modelValid = false;
      }

      this.errorMessage = this.dayErrorMessage || this.monthErrorMessage || this.yearErrorMessage;
      return this.modelValid;
    }

    const realDate = isRealDate(this.model?.year, this.model?.month, this.model?.day);
    if (!realDate) {
      this.dayErrorMessage = this.monthErrorMessage = this.yearErrorMessage = 'The date your safety case report was last updated must be a real date. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-day';
      this.modelValid = false;
    }

    const todayOrInPast = IsDateInPast(this.model!);
    if (!todayOrInPast) {
      this.dayErrorMessage = this.monthErrorMessage = this.yearErrorMessage = 'The date your safety case report was last updated must be today or in the past. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-day';
      this.modelValid = false;
    }

    this.errorMessage = this.dayErrorMessage || this.monthErrorMessage || this.yearErrorMessage;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(SafetyCaseReportDeclarationComponent.route, this.activatedRoute);
  }
}
