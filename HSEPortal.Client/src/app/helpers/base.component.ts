import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ApplicationService } from "../services/application.service";
import { NavigationService } from "../services/navigation.service";
import { IHasNextPage } from "./has-next-page.interface";

export abstract class BaseComponent implements CanActivate {

  constructor(protected router: Router, protected applicationService: ApplicationService, protected navigationService: NavigationService, protected activatedRoute: ActivatedRoute) { }

  abstract canContinue(): boolean;
  updateOnSave: boolean = false;

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  hasErrors = false;
  async saveAndContinue(): Promise<any> {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.applicationService.updateLocalStorage();
      await this.runInheritances();
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

  private async runInheritances(): Promise<void> {
    if (this.updateOnSave) {
      await this.applicationService.updateApplication();
    }

    var hasNextPage = <IHasNextPage><unknown>this;
    if (hasNextPage) {
      await hasNextPage.navigateToNextPage(this.navigationService, this.activatedRoute);
    }
  }
}