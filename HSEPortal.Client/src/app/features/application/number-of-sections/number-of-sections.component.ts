import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './number-of-sections.component.html'
})
export class NumberOfSectionsComponment extends BaseComponent implements IHasNextPage {
  static route: string = 'number-of-sections';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  numberOfSectionsHasErrors = false;
  canContinue(): boolean {
    this.numberOfSectionsHasErrors = !this.applicationService.model.NumberOfSections;
    return !this.numberOfSectionsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let route = '';
    this.applicationService.startSectionsEdit();
    if (this.applicationService.model.NumberOfSections == "one") {
      route = `floors`;
    }

    return navigationService.navigateRelative(`/sections/section-1/${route}`, activatedRoute);
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.applicationService.isCurrentApplication(routeSnapshot.params['id']);
  }

}
