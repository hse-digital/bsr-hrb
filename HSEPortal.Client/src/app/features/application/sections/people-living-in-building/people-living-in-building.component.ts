import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "src/app/services/application.service";
import { CaptionService } from "src/app/services/caption.service";
import { NavigationService } from "src/app/services/navigation.service";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionCheckAnswersComponent } from "../check-answers/check-answers.component";
import { AddMoreSectionsComponent } from "../add-more-sections/add-more-sections.component";

@Component({
  templateUrl: './people-living-in-building.component.html'
})
export class SectionPeopleLivingInBuildingComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'people-living';
  override updateOnSave: boolean = true;

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  peopleLivingHasErrors = false;

  canContinue(): boolean {
    let peopleLivingInBuilding = this.applicationService.currentSection.PeopleLivingInBuilding;
    this.peopleLivingHasErrors = !peopleLivingInBuilding;
    return !this.peopleLivingHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.ResidentialUnits;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(`../${AddMoreSectionsComponent.route}`, activatedRoute);
  }
}
