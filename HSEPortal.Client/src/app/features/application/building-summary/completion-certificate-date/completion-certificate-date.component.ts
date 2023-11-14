import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { CertificateNumberComponent } from '../certificate-number/certificate-number.component';
import { BuildingSummaryNavigation } from '../building-summary.navigation';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';

type CompletionDate = { day: string, month: string, year: string };
type error = { hasError: boolean, message?: string };

@Component({
  selector: 'hse-completion-certificate-date',
  templateUrl: './completion-certificate-date.component.html'
})
export class CompletionCertificateDateComponent extends PageComponent<CompletionDate> {
  static route: string = 'completion-certificate-date';
  static title: string = 'Completion certificate date - Register a high-rise building - GOV.UK';
  
  isOptional: boolean = true;

  dateInputErrorMessage?: string;
  errors?: {
    day?: error,
    month?: error,
    year?: error,
    format?: error,
    future?: error
  }

  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    
    this.isInputOptional(
      this.applicationService.currentSection.YearOfCompletionOption,
      this.applicationService.currentSection.YearOfCompletionRange,
      this.applicationService.currentSection.YearOfCompletion,
    );
    
    this.model = { day: "", month: "", year: "" } as CompletionDate;
    
    if (FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentSection.CompletionCertificateDate)) {
      this.initPageModel(this.applicationService.currentSection.CompletionCertificateDate);
    }
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    if(!this.isInputEmpty()) {
      this.applicationService.currentSection.CompletionCertificateDate = new Date(Number(this.model!.year!), (Number(this.model?.month) - 1), Number(this.model?.day)).getTime().toString();
    }
  }

  private initPageModel(completionCertificateDate?: string) {
    let date = new Date(Number(completionCertificateDate));
    this.model = {
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      year: date.getFullYear().toString()
    }
  }

  private isInputOptional(yearOfCompletionOption: string, yearOfCompletionRange?: string, yearOfCompletion?: string) {
    if (yearOfCompletionOption == 'year-exact') {
      var year = Number(yearOfCompletion);
      if (year && year >= 2023) {
        this.isOptional = false;
      }
    } else if (yearOfCompletionOption == 'year-not-exact') {
      if (yearOfCompletionRange == "2023-onwards") {
        this.isOptional = false;
      }
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    if (this.isOptional && this.isInputEmpty()) return true;
    this.errors = {};
    let isFormatValid = this.isDateFormatValid();
    let isInputValid = this.isDateNotNullOrWhitespace();
    isInputValid &&= isFormatValid && !this.isDateInFuture();
    return isFormatValid && isInputValid;
  }

  private isDateNotNullOrWhitespace() {
    let isValid = !!this.model;
    isValid &&= this.isDayValid();
    isValid &&= this.isMonthValid();
    isValid &&= this.isYearValid();
    if(!isValid) this.getErrorMessage();
    return isValid;
  }

  private isDateFormatValid() {
    let date = new Date(Number(this.model!.year!), Number(this.model?.month) - 1, Number(this.model?.day));
    let isValid = this.isDayValid() && this.isMonthValid() && this.isYearValid();
    isValid &&= date.getDate() == Number(this.model?.day) && (date.getMonth() + 1) == Number(this.model?.month) && date.getFullYear() == Number(this.model?.year);
    
    this.errors!.format = { hasError: !isValid, message: "Completion certificate date must be a real date, for example 27 3 2023" }
    this.dateInputErrorMessage = this.errors!.format.message;
    
    return isValid;
  }  

  private isDateInFuture() {
    let date = new Date(Number(this.model!.year!), Number(this.model?.month) - 1, Number(this.model?.day));
    let isInFuture = date > new Date(Date.now());
    this.errors!.future = { hasError: isInFuture, message: "Completion certificate date must be today or in the past" }
    this.dateInputErrorMessage = this.errors!.future.message;
    return isInFuture;
  }

  private getErrorMessage() {
    this.errors!.day = { hasError: !FieldValidations.IsNotNullOrWhitespace(this.model?.day), message: "Enter a day" };
  
    this.errors!.month = { hasError: !FieldValidations.IsNotNullOrWhitespace(this.model?.month), message: "Enter a month" };
    
    this.errors!.year = { hasError: !FieldValidations.IsNotNullOrWhitespace(this.model?.year), message: "Enter a year" };
  }

  private isDayValid() {
    return FieldValidations.IsNotNullOrWhitespace(this.model?.day) && !!Number(this.model?.day) && Number(this.model?.day) > 0 && Number(this.model?.day) <= 31;
  }

  private isMonthValid() {
    return FieldValidations.IsNotNullOrWhitespace(this.model?.month) && !!Number(this.model?.month) && Number(this.model?.month) > 0 && Number(this.model?.month) <= 12;
  }

  private isYearValid() {
    return FieldValidations.IsNotNullOrWhitespace(this.model?.year) && this.model?.year.length == 4 && !!Number(this.model?.year) && Number(this.model?.year) > 0;
  }

  private isInputEmpty() {
    return !FieldValidations.IsNotNullOrWhitespace(this.model?.day) 
      && !FieldValidations.IsNotNullOrWhitespace(this.model?.month)
      && !FieldValidations.IsNotNullOrWhitespace(this.model?.year);
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(CertificateNumberComponent.route, this.activatedRoute);
  }

  get buildingName() {
    return this.applicationService.model.NumberOfSections == "one" 
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }
}
