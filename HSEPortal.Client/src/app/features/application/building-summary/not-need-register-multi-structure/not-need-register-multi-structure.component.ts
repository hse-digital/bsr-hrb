import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, OutOfScopeReason } from 'src/app/services/application.service';
import { SectionNameComponent } from '../name/name.component';
import { AddMoreSectionsComponent } from '../add-more-sections/add-more-sections.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-not-need-register-multi-structure',
  templateUrl: './not-need-register-multi-structure.component.html'
})
export class NotNeedRegisterMultiStructureComponent extends PageComponent<void> {
  static route: string = 'not-need-register-multi-structure';
  static title: string = "You do not need to register this building - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void { }

  override async onSave(applicationService: ApplicationService): Promise<void> { }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean> {
    if (this.applicationService.model.Sections.length == 1) {
      let section = this.applicationService.startNewSection();
      let nextPage = `../${section}/${SectionNameComponent.route}`;
      await this.applicationService.updateApplication();
      return this.navigationService.navigateRelative(nextPage, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(`../${AddMoreSectionsComponent.route}`, this.activatedRoute);
  }

  sectionBuildingName() : string {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName! :
      this.applicationService.currentSection.Name!;
  }

  private OutOfScopeClarification: Record<OutOfScopeReason, string> = {
    [OutOfScopeReason.Height]: "You only need to tell us about high-rise residential structures that have at least 7 floors or are at least 18 metres in height.",
    [OutOfScopeReason.NumberResidentialUnits]: "You only need to register a high-rise building if it has at least 2 residential units.",
    [OutOfScopeReason.PeopleLivingInBuilding]: "You only need to register a high-rise building if you plan to allow residents to occupy it."
  }

  getClarification() {
    if (!!this.applicationService.currentSection.Scope) 
      return this.OutOfScopeClarification[this.applicationService.currentSection.Scope?.OutOfScopeReason!];
    return "";
  }
}
