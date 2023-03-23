import { QueryList } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { ApplicationService } from "../services/application.service";
import { NavigationService } from "../services/navigation.service";
import { TitleService } from "../services/title.service";
import { IHasNextPage } from "./has-next-page.interface";

export abstract class BaseComponent implements CanActivate {

  summaryError?: QueryList<GovukErrorSummaryComponent>;

  returnUrl?: string;
  updateOnSave: boolean = true;
  constructor(protected router: Router, protected applicationService: ApplicationService, protected navigationService: NavigationService, protected activatedRoute: ActivatedRoute, protected titleService: TitleService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['return'];
    });
  }

  abstract canContinue(): boolean;
  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  hasErrors = false;
  processing = false;
  async saveAndContinue(): Promise<any> {
    this.processing = true;
    
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.screenReaderNotification();

      await this.onSave();

      this.applicationService.updateLocalStorage();
      if (this.updateOnSave)
        await this.applicationService.updateApplication();

      await this.runInheritances();
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }

    this.processing = false;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

  async onSave() { }

  private async runInheritances(): Promise<void> {
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

  protected screenReaderNotification(message: string = "Sending success") {
    document!.getElementById("hiddenAlertContainer")!.innerHTML = message;
  }
}
