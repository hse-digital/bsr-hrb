import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, OutOfScopeReason } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { SectionNameComponent } from '../name/name.component';
import { AddMoreSectionsComponent } from '../add-more-sections/add-more-sections.component';

@Component({
  selector: 'hse-not-need-register-multi-structure',
  templateUrl: './not-need-register-multi-structure.component.html'
})
export class NotNeedRegisterMultiStructureComponent  extends BaseComponent implements IHasNextPage {

  static route: string = 'height';
  static title: string = "What is the section height - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  heightHasErrors = false;
  errorMessage: string = 'Enter the height in metres';

  canContinue(): boolean {
    return true;
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  async navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.model.Sections.length == 1) {
      let section = this.applicationService.startNewSection();
      let nextPage = `${section}/${SectionNameComponent.route}`;
      await this.applicationService.updateApplication();
      return navigationService.navigateRelative(nextPage, activatedRoute);
    }
    return navigationService.navigateRelative(AddMoreSectionsComponent.route, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  private OutOfScopeClarification: Record<OutOfScopeReason, string> = {
    [OutOfScopeReason.Height]: "You only need to tell us about high-rise residential structures that have at least 7 floors or are at least 18 metres in height.",
    [OutOfScopeReason.NumberResidentialUnits]: "You only need to register a high-rise building if it has at least 2 residential units.",
    [OutOfScopeReason.PeopleLivingInBuilding]: "You can only need to register a high-rise building if you plan to allow residents to occupy it."
  }

  getClarification() {
    return this.OutOfScopeClarification[this.applicationService.currentSection.Scope!.OutOfScopeReason!];
  }

}
