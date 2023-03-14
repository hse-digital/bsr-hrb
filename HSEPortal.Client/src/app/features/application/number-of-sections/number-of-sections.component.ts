import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './number-of-sections.component.html'
})
export class NumberOfSectionsComponment extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'number-of-sections';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  private previousAnswer?: string;
  ngOnInit(): void {
    this.previousAnswer = this.applicationService.model.NumberOfSections;
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.BlocksInBuildingInProgress;
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
      if (this.applicationService.model.NumberOfSections == "one") {
        // keep only first section
        var firstSection = this.applicationService.model.Sections[0];
        this.applicationService.model.Sections = [firstSection];
      } else {
        // start a new section and move to that section's screen
        var section = this.applicationService.startNewSection();
        return navigationService.navigateRelative(`/sections/${section}`, activatedRoute);
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

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.applicationService.isCurrentApplication(routeSnapshot.params['id']);
  }

}
