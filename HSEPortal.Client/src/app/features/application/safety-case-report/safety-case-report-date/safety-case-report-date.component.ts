import { Component } from '@angular/core';
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
  errorAnchorId: string = 'safety-case-report-date-day';
  errorMessage: string = ''; 
  modelValid: boolean = true;

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
    this.modelValid = false;

    const nothingEntered = isEmpty(this.model?.day, this.model?.month, this.model?.year);  
    if (nothingEntered) {
      this.errorMessage = 'Enter the date your safety case report was last updated. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-day';
      return this.modelValid;
    }

    const allEntered = isFull(this.model?.day, this.model?.month, this.model?.year);
    if (!allEntered) {
      const dayValid = isDayValid(this.model?.day);
      if (!dayValid) {
        this.errorMessage = 'The date your safety case report was last updated must be today or in the past. For example, 27 10 2023.';
        this.errorAnchorId = 'safety-case-report-date-day';
        return this.modelValid;
      }

      const monthValid = isMonthValid(this.model?.month);
      if (!monthValid) {
        this.errorMessage = 'The date your safety case report was last updated must contain a month and a year. For example, 27 10 2023.';
        this.errorAnchorId = 'safety-case-report-date-month';
        return this.modelValid;
      }

      const yearValid = isYearValid(this.model?.year);
      if (!yearValid) {
        this.errorMessage = 'The date your safety case report was last updated must contain a year. For example, 27 10 2023.';
        this.errorAnchorId = 'safety-case-report-date-year';
        return this.modelValid;
      }

      const yearLengthValid = isYearLengthValid(this.model?.year);
      if (!yearLengthValid) {
        this.errorMessage = 'The date your safety case report was last updated must contain a year. Year must include 4 numbers.';
        this.errorAnchorId = 'safety-case-report-date-year';
        return this.modelValid;
      }
    }

    const realDate = isRealDate(this.model?.year, this.model?.month, this.model?.day);
    if (!realDate) {
      this.errorMessage = 'The date your safety case report was last updated must be a real date. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-day';
      return this.modelValid;
    } 
    
    const todayOrInPast = IsDateInPast(this.model!);
    if (!todayOrInPast) {
      this.errorMessage = 'The date your safety case report was last updated must be today or in the past. For example, 27 10 2023.';
      this.errorAnchorId = 'safety-case-report-date-day';
      return this.modelValid;
    }

    this.modelValid = true;

    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(SafetyCaseReportDeclarationComponent.route, this.activatedRoute);
  }
}
