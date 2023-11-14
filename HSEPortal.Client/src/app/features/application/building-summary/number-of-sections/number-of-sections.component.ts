import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStage } from 'src/app/services/application.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';
import { BuildingChangeCheckAnswersComponent } from 'src/app/features/registration-amendments/change-building-summary/building-change-check-answers/building-change-check-answers.component';
import { RegistrationAmendmentsModule } from 'src/app/features/registration-amendments/registration-amendments.module';

@Component({
  templateUrl: './number-of-sections.component.html'
})
export class NumberOfSectionsComponment extends PageComponent<string> {

  static route: string = 'number-of-sections';
  static title: string = "Count the number of sections in your building - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  private previousAnswer?: string;
  numberOfSectionsHasErrors = false;


  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.model = this.applicationService.model.NumberOfSections ?? "";
    this.previousAnswer = this.applicationService.model.NumberOfSections;
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.BlocksInBuildingInProgress;
    await this.applicationService.updateDynamicsBuildingSummaryStage();
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.NumberOfSections = this.model;
    if (!this.applicationService.currentVersion.Sections || this.applicationService.currentVersion.Sections.length == 0) {
      this.applicationService.startSectionsEdit();
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.applicationService.isCurrentApplication(routeSnapshot.params['id']);
  }

  override isValid(): boolean {
    this.numberOfSectionsHasErrors = !this.model;
    return !this.numberOfSectionsHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    let changing = this.applicationService.currentVersion.Name != "original";
    if (changing && this.applicationService.model.NumberOfSections == "one") {
      return this.navigationService.navigateRelative(`/${RegistrationAmendmentsModule.baseRoute}/${BuildingChangeCheckAnswersComponent.route}`, this.activatedRoute);
    }
    // user is changing the answer
    if (this.previousAnswer && this.previousAnswer != this.applicationService.model.NumberOfSections) {
      this.applicationService.model.ApplicationStatus &= ~BuildingApplicationStage.BlocksInBuildingComplete;
      this.applicationService.updateApplication();

      var firstSection = this.applicationService.currentVersion.Sections[0];
      if (this.applicationService.model.NumberOfSections == "one") {
        // keep only first section
        this.applicationService.currentVersion.Sections = [firstSection];
      } else {
        if (!FieldValidations.IsNotNullOrWhitespace(firstSection.Name)) {
          return this.navigationService.navigateRelative(`/sections/section-1`, this.activatedRoute);
        } else {
          var sectionRoute = this.applicationService.startNewSection();
          return this.navigationService.navigateRelative(`/sections/${sectionRoute}`, this.activatedRoute);
        }
      }
    }

    if (this.returnToCheckAnswers)
      return this.navigationService.navigateRelative(`/sections/check-answers`, this.activatedRoute);

    let route = '';
    if (this.applicationService.model.NumberOfSections == "one") {
      route = `floors`;
    }

    return this.navigationService.navigateRelative(`/sections/section-1/${route}`, this.activatedRoute);
  }

  private returnToCheckAnswers: boolean = false;
  updateReturnUrl() {
    if (this.applicationService.model.NumberOfSections != this.previousAnswer) {
      this.returnToCheckAnswers = this.returnUrl != undefined;
      this.returnUrl = undefined;
    }
  }


}
