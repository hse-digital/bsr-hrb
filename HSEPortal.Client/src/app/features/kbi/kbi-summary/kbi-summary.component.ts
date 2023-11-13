import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { BroadcastChannelSecondaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { LocalStorage } from 'src/app/helpers/local-storage';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, BuildingRegistrationModel, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './kbi-summary.component.html',
  styleUrls: ['./kbi-summary.component.scss']
})
export class KbiSummaryComponent implements OnInit, CanActivate {
  public static route: string = 'summary';
  static title: string = "Summary - structure and safety information - GOV.UK";

  submissionDate?: string;
  InScopeStructures?: SectionModel[];
  shouldRender: boolean = false;

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) { }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return true;
  }

  async ngOnInit() {
    if (!FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.BuildingName)) {
      await this.getApplicationDataFromBroadcastChannel();
    }

    if (!this.kbiComplete()) {
      this.navigationService.navigate(NotFoundComponent.route);
    } else {
      this.shouldRender = true;
    }

    this.InScopeStructures = this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope);
    if (this.InScopeStructures.length == 1) {
      this.applicationService.currentVersion.Kbi!.KbiSections[0].StructureName = this.applicationService.model.BuildingName;
    } else {
      this.InScopeStructures.forEach((x, index) => this.applicationService.currentVersion.Kbi!.KbiSections[index].StructureName = x.Name)
    }

    this.submissionDate = await this.applicationService.getKbiSubmissionDate();
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

  private paymentComplete(): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentComplete) == BuildingApplicationStage.PaymentComplete
  }

  private kbiComplete(): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete
  }
}
