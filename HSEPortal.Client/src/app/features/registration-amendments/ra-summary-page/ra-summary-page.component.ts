import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { BroadcastChannelSecondaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { LocalStorage } from 'src/app/helpers/local-storage';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingRegistrationModel } from 'src/app/services/application.service';
import { Change, ChangeCategory, ChangeRequest } from 'src/app/services/registration-amendments.service';

@Component({
  selector: 'hse-ra-summary-page',
  templateUrl: './ra-summary-page.component.html',
  styles: ['.govuk-summary-list__key { width:20%!important; }']

})
export class RaSummaryPageComponent  extends PageComponent<void> {
  public static route: string = "summary";
  static title: string = "Changes you have already told us about - Register a high-rise building - GOV.UK";

  shouldRender: boolean = false;

  changeRequest?: ChangeRequest[];
  applicantChanges: Change[] = [];
  structureChanges: Change[] = [];
  
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if(!FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.BuildingName)) {
      await this.getApplicationDataFromBroadcastChannel();
    }

    this.changeRequest = await this.registrationAmendmentsService.getChangeRequest();

    this.applicantChanges = this.getApplicantChanges() ?? [];
    this.structureChanges = this.getStructureChanges() ?? [];

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

  private getApplicantChanges(): Change[] {
    if (!this.changeRequest || this.changeRequest!.length == 0) return [];
    let changes = this.changeRequest!.find(x => x.Category == ChangeCategory.ChangeApplicantUser)?.Change?.filter(x => x.FieldName?.endsWith('Applicant')) ?? [];
    
    console.log('applicantChanges', changes);

    return changes;
  }

  private getStructureChanges(): Change[] {
    if (!this.changeRequest || this.changeRequest!.length == 0) return [];
    let changes = this.changeRequest!.find(x => x.Category == ChangeCategory.ApplicationBuildingAmendments)?.Change?.filter(x => x.Table == "Structure") ?? [];

    console.log('structureChanges', changes);

    return changes;
  }
}
