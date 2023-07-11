import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStatus, BuildingRegistrationModel, PaymentModel, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { SectionHelper } from 'src/app/helpers/section-helper';
import { LocalStorage } from 'src/app/helpers/local-storage';
import { BroadcastChannelSecondaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

@Component({
  selector: 'hse-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent extends BaseComponent implements IHasNextPage, OnInit {
  public static route: string = "summary";
  static title: string = "Summary - Register a high-rise building - GOV.UK";

  sections: SectionModel[] = [];
  payment?: any;
  shouldRender: boolean = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  async ngOnInit() {
    if(!FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.BuildingName)) {
      await this.getApplicationDataFromBroadcastChannel();
    } else if ((this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) != BuildingApplicationStatus.PaymentComplete) {
        this.navigationService.navigate(NotFoundComponent.route);
    } else {
      this.shouldRender = true;
    }
    this.sections = this.applicationService.model.Sections;
    
    var payments = await this.applicationService.getApplicationPayments()
    this.payment = payments.find(x => x.bsr_govukpaystatus == "success");
  }

  canContinue() {
    return true;
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('', activatedRoute);
  }

  getSectionName(sectionIndex: number, section?: SectionModel) {
    return section?.Name ?? `${SectionHelper.getSectionCardinalName(sectionIndex)} high-rise residential structure`;
  }

  private async getApplicationDataFromBroadcastChannel() {
    await new BroadcastChannelSecondaryHelper()
      .OpenChannel("application_data")
      .JoinChannel()
      .WaitForData<BuildingRegistrationModel>()
      .then((data: BuildingRegistrationModel) => {
        LocalStorage.setJSON("application_data", data);
        this.applicationService.model = data;

        if ((this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) != BuildingApplicationStatus.PaymentComplete) {
          this.navigationService.navigate(NotFoundComponent.route);
        } else {
          this.shouldRender = true;
        }
      })
      .catch(() => this.navigationService.navigate(NotFoundComponent.route)); 

  }
}
