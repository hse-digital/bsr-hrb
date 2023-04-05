import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStatus, PaymentModel, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { SectionHelper } from 'src/app/helpers/section-helper';

@Component({
  selector: 'hse-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent extends BaseComponent implements IHasNextPage, OnInit {
  public static route: string = "summary";
  static title: string = "Summary - Register a high-rise building - GOV.UK";

  sections: SectionModel[] = [];
  payment?: PaymentModel;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  async ngOnInit() {
    this.sections = this.applicationService.model.Sections;
    
    var payments = await this.applicationService.getApplicationPayments()
    this.payment = payments.find(x => x.Status == 'success');
  }

  canContinue() {
    return true;
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('', activatedRoute);
  }

  getSectionName(sectionIndex: number, section?: SectionModel) {
    return section?.Name ?? `${SectionHelper.getSectionCardinalName(sectionIndex)} high-rise residential structure`;
  }
}
