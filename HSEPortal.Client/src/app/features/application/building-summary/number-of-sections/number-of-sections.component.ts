import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

@Component({
  templateUrl: './number-of-sections.component.html'
})
export class NumberOfSectionsComponment extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'number-of-sections';
  static title: string = "Count the number of sections in your building - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  private previousAnswer?: string;
  async ngOnInit(): Promise<void> {
    this.previousAnswer = this.applicationService.model.NumberOfSections;
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.BlocksInBuildingInProgress;
    await this.applicationService.updateDynamicsBuildingSummaryStage();
  }

  numberOfSectionsHasErrors = false;
  canContinue(): boolean {
    this.numberOfSectionsHasErrors = !this.applicationService.model.NumberOfSections;
    return !this.numberOfSectionsHasErrors;
  }

  override async onSave(): Promise<void> {
    if (!this.applicationService.model.Sections || this.applicationService.model.Sections.length == 0) {
      this.applicationService.startSectionsEdit();
    }
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    // user is changing the answer
    if (this.previousAnswer && this.previousAnswer != this.applicationService.model.NumberOfSections) {
      this.applicationService.model.ApplicationStatus &= ~BuildingApplicationStatus.BlocksInBuildingComplete;
      this.applicationService.updateApplication();

      var firstSection = this.applicationService.model.Sections[0];
      if (this.applicationService.model.NumberOfSections == "one") {
        // keep only first section
        this.applicationService.model.Sections = [firstSection];
      } else {
        if (!FieldValidations.IsNotNullOrWhitespace(firstSection.Name)) {
          return navigationService.navigateRelative(`/sections/section-1`, activatedRoute);
        } else {
          var sectionRoute = this.applicationService.startNewSection();
          return navigationService.navigateRelative(`/sections/${sectionRoute}`, activatedRoute);
        }
      }
    }

    if (this.returnToCheckAnswers)
      return navigationService.navigateRelative(`/sections/check-answers`, activatedRoute);

    let route = '';
    if (this.applicationService.model.NumberOfSections == "one") {
      route = `floors`;
    }

    return navigationService.navigateRelative(`/sections/section-1/${route}`, activatedRoute);
  }

  private returnToCheckAnswers: boolean = false;
  updateReturnUrl() {
    if (this.applicationService.model.NumberOfSections != this.previousAnswer) {
      this.returnToCheckAnswers = this.returnUrl != undefined;
      this.returnUrl = undefined;
    }
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.applicationService.isCurrentApplication(routeSnapshot.params['id']);
  }

}