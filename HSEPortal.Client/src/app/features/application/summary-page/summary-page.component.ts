import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStage, BuildingRegistrationModel, SectionModel } from 'src/app/services/application.service';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { LocalStorage } from 'src/app/helpers/local-storage';
import { BroadcastChannelSecondaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'hse-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent extends PageComponent<void> {
  public static route: string = "summary";
  static title: string = "Summary - Register a high-rise building - GOV.UK";

  sections: SectionModel[] = [];
  payment?: any;
  shouldRender: boolean = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if(!FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.BuildingName)) {
      await this.getApplicationDataFromBroadcastChannel();
    } 

    if (this.applicationService.model.PaymentType == 'card' && (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentComplete) != BuildingApplicationStage.PaymentComplete) {
      this.navigationService.navigate(NotFoundComponent.route);
    } else {
      this.shouldRender = true;
    }
    
    this.sections = this.applicationService.model.Sections;

    var payments = await this.applicationService.getApplicationPayments()
    this.payment = payments.find(x => x.bsr_govukpaystatus == "success" || x.bsr_govukpaystatus == "paid");
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

  getSectionName(sectionIndex: number, section?: SectionModel) {
    return section?.Name ?? `${SectionHelper.getSectionCardinalName(sectionIndex)} high-rise residential structure`;
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
}
