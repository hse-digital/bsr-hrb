import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ChangeSection, ApplicationService, Status } from 'src/app/services/application.service';
import { BuildingChangeCheckAnswersComponent } from '../building-change-check-answers/building-change-check-answers.component';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';
import { Dictionary } from 'src/app/services/file-upload.service';
import { CancellationReason } from 'src/app/services/registration-amendments.service';

@Component({
  selector: 'hse-why-remove',
  templateUrl: './why-remove.component.html'
})
export class WhyRemoveComponent  extends PageComponent<string> {
  static route: string = 'why-remove-structure';
  static title: string = "Why do you want to remove this structure - Register a high-rise building - GOV.UK";

  index?: number;
  changedSection?: ChangeSection;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.activatedRoute.queryParams.subscribe(params => {
      this.index = params['index'];
      if(!this.index) this.navigationService.navigateRelative(NotFoundComponent.route, this.activatedRoute);
      this.model = this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[this.index ?? 0].WhyWantRemoveSection;
    });
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections[this.index ?? 0].WhyWantRemoveSection = this.model;
    this.applicationService.model.Sections[this.index ?? 0].CancellationReason = this.CancellationReasonMapper[this.model ?? ""];
  }

  private CancellationReasonMapper: Record<string, CancellationReason> = {
    "floors_height": CancellationReason.FloorsHeight,
    "residential_units": CancellationReason.ResidentialUnits,
    "everyone_moved_out": CancellationReason.EveryoneMovedOut,
    "incorrectly_registered": CancellationReason.IncorrectlyRegistered,
    "no_connected": CancellationReason.NoConnected,
    "": CancellationReason.NoCancellationReason
  };

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections && this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections?.length > 0;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections!.filter(x => x.Status != Status.Removed)!.length > 1) {
      return this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { index: this.index }); 
  }

  get errorMessage() {
    return `Select why you want to remove ${this.sectionName}`;
  }

  get sectionName() {
    return this.applicationService.model.Sections[this.index ?? 0].Name;
  }
}
