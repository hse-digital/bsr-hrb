import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { BroadcastChannelSecondaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { LocalStorage } from 'src/app/helpers/local-storage';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingRegistrationModel, Status, User } from 'src/app/services/application.service';

@Component({
  selector: 'hse-ra-summary-page',
  templateUrl: './ra-summary-page.component.html'
})
export class RaSummaryPageComponent  extends PageComponent<void> {
  public static route: string = "summary";
  static title: string = "Changes you have already told us about - Register a high-rise building - GOV.UK";

  shouldRender: boolean = false;

  primaryUser?: User;
  secondaryUser?: User;
  
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if(!FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.BuildingName)) {
      await this.getApplicationDataFromBroadcastChannel();
    } 

    this.primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
    this.secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;

    this.shouldRender = true;
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> { }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }
  
  override isValid(): boolean {
    return true;
  }
  
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative('', this.activatedRoute);
  }

  private async getApplicationDataFromBroadcastChannel() {
    await firstValueFrom(this.activatedRoute.params)
      .then(async param => param['id'])
      .then(async id =>
        await new BroadcastChannelSecondaryHelper()
          .OpenChannel(id)
          .JoinChannel()
          .WaitForData<BuildingRegistrationModel>())
      .then((data: BuildingRegistrationModel) => {
        LocalStorage.setJSON("application_data", data);
        this.applicationService.model = data;
      })
      .catch(() => this.navigationService.navigate(NotFoundComponent.route));
  }

  
  isThereNewPrimaryUser() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser?.Status == Status.ChangesSubmitted
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser?.Email)
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser?.Firstname);
  }

  isThereNewSecondaryUser() {
    return true;
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser?.Status == Status.ChangesSubmitted
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser?.Email)
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser?.Firstname);
  }

  isTherePreviousSecondaryUser() {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.SecondaryEmailAddress)
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.SecondaryFirstName);
  }

  secondaryUserRemoved() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Status == Status.Removed;
  }

}
