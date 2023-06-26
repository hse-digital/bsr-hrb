import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  templateUrl: './kbi-summary.component.html',
  styleUrls: ['./kbi-summary.component.scss']
})
export class KbiSummaryComponent implements OnInit, CanActivate {
  public static route: string = 'summary';
  static title: string = "Summary - structure and safety information - GOV.UK";

  submissionDate?: string;

  constructor(public applicationService: ApplicationService) {
  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return true;
  }

  async ngOnInit() {
    if (this.applicationService.model.Sections.length == 1) {
      this.applicationService.model.Kbi!.KbiSections[0].StructureName = this.applicationService.model.BuildingName;
    } else {
      this.applicationService.model.Sections.forEach((x, index) => this.applicationService.model.Kbi!.KbiSections[index].StructureName = x.Name)
    }

    this.submissionDate = await this.applicationService.getSubmissionDate();
  }
}
