import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ApplicationService } from "../services/application.service";
import { NavigationService } from "../services/navigation.service";
import { IHasNextPage } from "./has-next-page.interface";

export abstract class BaseComponent implements CanActivate {

  returnUrl?: string;
  constructor(protected router: Router, protected applicationService: ApplicationService, protected navigationService: NavigationService, protected activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['return'];
    });
  }

  abstract canContinue(): boolean;
  updateOnSave: boolean = false;

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  hasErrors = false;
  async saveAndContinue(): Promise<any> {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      await this.onSave();
      this.applicationService.updateLocalStorage();
      await this.runInheritances();
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

  async onSave() {}

  private async runInheritances(): Promise<void> {
    if (this.updateOnSave) {
      await this.applicationService.updateApplication();
    }

    if (this.returnUrl) {
      let returnUri = this.returnUrl == 'check-answers' ? `../${this.returnUrl}` : this.returnUrl;
      this.navigationService.navigateRelative(returnUri, this.activatedRoute);
      return;
    }

    var hasNextPage = <IHasNextPage><unknown>this;
    if (hasNextPage) {
      await hasNextPage.navigateToNextPage(this.navigationService, this.activatedRoute);
    }
  }
}
