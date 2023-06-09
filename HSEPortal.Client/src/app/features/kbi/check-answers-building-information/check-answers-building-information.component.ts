import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, KbiSectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { KbiCheckAnswersModule } from './kbi.check-answers-building-information.module';
import { KbiNavigation } from '../kbi.navigation.ts.service';

@Component({
  templateUrl: './check-answers-building-information.component.html',
  styleUrls: ['./check-answers-building-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuildingInformationCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers-building-information';
  static title: string = "Check your building information answers - Register a high-rise building - GOV.UK";

  kbiSection: KbiSectionModel = new KbiSectionModel;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, private kbiNavigation: KbiNavigation) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    let route = this.kbiNavigation.getNextRoute();
    console.log(route);
    //this.navigateWithReturn(`../${route}`);

    this.kbiSection = this.applicationService.currentKbiSection!;
  }

  hasIncompleteData = false;
  canContinue(): boolean {
    var canContinue = true;

    this.applicationService.model.Kbi!.SectionStatus[this.applicationService._currentKbiSectionIndex].InProgress = false;
    this.applicationService.model.Kbi!.SectionStatus[this.applicationService._currentKbiSectionIndex].Complete = true;


    this.hasIncompleteData = !canContinue;
    return canContinue;
  }

  override async onSave(): Promise<void> {
    //await this.applicationService.syncAccountablePersons();
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if(this.applicationService.model.Kbi!.SectionStatus.length == 1) {
      //return navigationService.navigateRelative(.route, activatedRoute); goes to high rise building connections
    } else if (!this.allKbiSectionCompleted()) {
      // goes to task list
    }
    return navigationService.navigateRelative(BuildingInformationCheckAnswersComponent.route, activatedRoute); // goes to connection between blocks
  }

  private allKbiSectionCompleted(){
    return this.applicationService.model.Kbi!.SectionStatus.map(x => x.Complete).reduce((a, b) => a && b);
  }

  override canAccess(_: ActivatedRouteSnapshot): boolean {
    return true;
  }

  navigateTo(url: string, group: string) {
    this.navigateWithReturn(`../${group}/${url}`);
  }

  private navigateWithReturn(url: string) {
    this.navigationService.navigateRelative(url, this.activatedRoute, {
      return:`../${KbiCheckAnswersModule.baseRoute}/${BuildingInformationCheckAnswersComponent.route}`
    });
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }
}
