import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from "src/app/services/title.service";
import { CertificateNumberComponent } from "../certificate-number/certificate-number.component";

@Component({
  templateUrl: './certificate-issuer.component.html'
})
export class CertificateIssuerComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'certificate-issuer';
  static title: string = "Who is the section completion certificate issuer? - Register a high-rise building - GOV.UK";

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(CertificateNumberComponent.route, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }
  
}
