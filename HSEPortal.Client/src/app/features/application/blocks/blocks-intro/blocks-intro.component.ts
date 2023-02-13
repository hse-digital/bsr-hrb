import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  templateUrl: './blocks-intro.component.html'
})
export class BuildingBlocksIntroComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'intro';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute)

    // REMOVE
    this.applicationService.newApplication();
    // ######

    this.initializeNewBlock();
  }

  initializeNewBlock() {
    let blockId = this.activatedRoute?.snapshot.params["blockId"];
    this.applicationService.currentBlock = { Id: blockId };
    this.applicationService.model.Blocks?.push(this.applicationService.currentBlock);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('name', activatedRoute);
  }

}
