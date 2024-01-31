import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, SafetyCaseReport } from 'src/app/services/application.service';
import { PageComponent } from 'src/app/helpers/page.component';
import { DateModel, IsDateInPast, isDayValid, isMonthValid, isYearLengthValid, isYearValid } from 'src/app/helpers/validators/date-validators';

@Component({
  templateUrl: './safety-case-report-date.component.html'
})
export class SafetyCaseReportDateComponent extends PageComponent<DateModel> {
  static route: string = "date";
  static title: string = "When was the safety case report last updated? – Register a high-rise building – GOV.UK";
  buildingName?: string;
  errorAnchorId: string = 'safety-case-report-date-day';
  errorMessage: string = '';
  modelValid: boolean = true;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.buildingName = this.applicationService.model.BuildingName;
    if (!this.applicationService.model.safetyCaseReport) {
      this.applicationService.model.safetyCaseReport = new SafetyCaseReport();
    }
    this.model = new DateModel(this.applicationService.model.safetyCaseReport.date);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.safetyCaseReport!.date = this.model!.toDateString();
    console.log(this.applicationService.model.safetyCaseReport!.date);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    this.modelValid = false;
    const dayValid = isDayValid(this.model?.day, this.model?.month || 0, this.model?.year || 2000);
    const monthValid = isMonthValid(this.model?.month);
    const yearValid = isYearValid(this.model?.year, true);
    const yearLengthValid = isYearLengthValid(this.model?.year);
    const noneSelected = !dayValid && !monthValid && !yearValid;    

    if (noneSelected) {
      this.errorMessage = 'Enter the date your safety case report was last updated. For example, 27 10 2023';
      this.errorAnchorId = 'safety-case-report-date-day';
      return this.modelValid;
    }

    if (!dayValid) {
      this.errorMessage = 'The date your safety case report was last updated must be today or in the past. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-day';
      return this.modelValid;
    }

    if (!monthValid) {
      this.errorMessage = 'The date your safety case report was last updated must contain a month and a year. For example, 27 10 2023..';
      this.errorAnchorId = 'safety-case-report-date-month';
      return this.modelValid;
    }

    if (!yearValid) {
      this.errorMessage = 'The date your safety case report was last updated must contain a year. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-year';
      return this.modelValid;
    }

    if (!yearLengthValid) {
      this.errorMessage = 'The date your safety case report was last updated must contain a year. Year must include 4 numbers.';
      this.errorAnchorId = 'safety-case-report-date-year';
      return this.modelValid;
    }
    
    let todayOrInPast = IsDateInPast(this.model!);
    if (!todayOrInPast) {
      this.errorMessage = 'The date your safety case report was last updated must be today or in the past. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-day';
      return this.modelValid;
    }   

    this.modelValid = true;

    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return Promise.resolve(true); // go to safety case declaration
  }
}
