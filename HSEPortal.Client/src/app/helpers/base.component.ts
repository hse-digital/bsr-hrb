import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ApplicationService } from "../services/application.service";
import { NavigationService } from "../services/navigation.service";
import { IHasNextPage } from "./has-next-page.interface";

export abstract class BaseComponent implements CanActivate {

  constructor(protected router: Router, protected applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) { }

  abstract canContinue(): boolean;
  
  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  hasErrors = false;
  async saveAndContinue(): Promise<any> {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.applicationService.updateLocalStorage();
      
      var hasNextPage = <IHasNextPage><unknown>this;
      if (hasNextPage) {
        await hasNextPage.navigateToNextPage(this.navigationService, this.activatedRoute);
      }
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }
}
