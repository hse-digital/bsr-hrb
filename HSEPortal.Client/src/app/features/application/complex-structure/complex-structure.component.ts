import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-complex-structure',
  templateUrl: './complex-structure.component.html'
})
export class ComplexStructureComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'complex-structure';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    return true;
  }

  nextPage = ''
  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    this.applicationService.startSectionsEdit();
    let route = `/sections/section-1/${this.nextPage}`;

    return navigationService.navigateRelative(route, activatedRoute);
  }

  override canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return this.applicationService.isCurrentApplication(routeSnapshot.params['id']);
  }

}
