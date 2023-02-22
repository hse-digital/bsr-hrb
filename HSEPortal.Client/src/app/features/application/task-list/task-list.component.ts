import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  templateUrl: './task-list.component.html'
})
export class ApplicationTaskListComponent extends BaseComponent {

  static route: string = '';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.applicationService.model?.id !== undefined && this.applicationService.model?.id == routeSnapshot.params['id'];
  }

  navigateToSections() {
    let appendRoute = 'complex-structure';

    if (this.applicationService.model.Sections?.length > 0) {
      appendRoute = 'sections/check-answers'
    }
    
    this.navigationService.navigateAppend(appendRoute, this.activatedRoute);
  }
}
