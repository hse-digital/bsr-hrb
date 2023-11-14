import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, Status } from 'src/app/services/application.service';
import { BuildingChangeCheckAnswersComponent } from '../building-change-check-answers/building-change-check-answers.component';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';

@Component({
  selector: 'hse-why-remove',
  templateUrl: './why-remove.component.html'
})
export class WhyRemoveComponent  extends PageComponent<string> {
  static route: string = 'why-remove-structure';
  static title: string = "Why do you want to remove this structure - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.model = this.applicationService.currentSection.WhyWantRemoveSection;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.WhyWantRemoveSection = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentSection;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentVersion.Sections!.filter(x => x.Status != Status.Removed)!.length > 1) {
      return this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute); 
  }

  get errorMessage() {
    return `Select why you want to remove ${this.sectionName}`;
  }

  get sectionName() {
    return this.applicationService.currentSection.Name;
  }
}
