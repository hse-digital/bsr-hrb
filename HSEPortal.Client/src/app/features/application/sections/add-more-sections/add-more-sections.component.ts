import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { SectionFloorsAboveComponent } from '../floors-above/floors-above.component';

@Component({
  templateUrl: './add-more-sections.component.html',
  styleUrls: ['./add-more-sections.component.scss']
})
export class AddMoreSectionsComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'add-more'

  constructor(router: Router, private captionService: CaptionService, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  anotherBlockHasErrors = false;
  addAnotherSectionLink?: string;

  canContinue(): boolean {
    this.anotherBlockHasErrors = !this.addAnotherSectionLink;
    return !this.anotherBlockHasErrors;
  }

  get blockNames(): string | undefined {
    let blockNames = this.applicationService.model.Sections?.map(x => x.Name);
    if (blockNames) return blockNames.reduce((name, current) => current + ", " + name);
    return undefined;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentSection.PeopleLivingInBuilding;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextPage = 'more-information';

    if (this.addAnotherSectionLink === 'yes') {
      let section = this.applicationService.startNewSection();
      nextPage = `${section}/${SectionFloorsAboveComponent.route}`;
    }

    return navigationService.navigateRelative(nextPage, activatedRoute);
  }
}
