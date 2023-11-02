import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ChangeSection, ApplicationService, Status, BuildingApplicationStage, BuildingApplicationStatuscode } from 'src/app/services/application.service';
import { BuildingChangeCheckAnswersComponent } from '../../change-building-summary/building-change-check-answers/building-change-check-answers.component';
import { WhyRemoveComponent } from '../../change-building-summary/why-remove/why-remove.component';

@Component({
  selector: 'hse-deregister-are-you-sure',
  templateUrl: './deregister-are-you-sure.component.html'
})
export class DeregisterAreYouSureComponent  extends PageComponent<string> {
  static route: string = 'deregister-are-you-sure';
  static title: string = "Confirm you want to remove this building - Register a high-rise building - GOV.UK";

  index?: number;
  changedSection?: ChangeSection;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.activatedRoute.queryParams.subscribe(params => {
      this.index = params['index'];
      if(!this.index) this.navigationService.navigateRelative(NotFoundComponent.route, this.activatedRoute);
      this.model = this.applicationService.model.RegistrationAmendmentsModel?.ChangeBuildingSummary?.Sections[this.index ?? 0].RemoveStructureAreYouSure;
    });
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {

  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if(this.model == 'yes') {
      return this.navigationService.navigateRelative(WhyRemoveComponent.route, this.activatedRoute, { index: this.index });
    } else if (this.applicationService.model.RegistrationAmendmentsModel!.ChangeBuildingSummary!.Sections!.filter(x => x.Status != Status.Removed)!.length > 1) {
      return this.navigationService.navigateRelative(BuildingChangeCheckAnswersComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(`../${NumberOfSectionsComponment.route}`, this.activatedRoute, { index: this.index });
  }

  get errorMessage() {
    return `Select yes to confirm you want to remove ${this.applicationService.model.BuildingName}`;
  }

  async isApplicationAccepted() {
    let statuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
    return statuscode == BuildingApplicationStatuscode.Registered || statuscode == BuildingApplicationStatuscode.RegisteredKbiValidated;
  }

}
