import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { NotFoundComponent } from "../components/not-found/not-found.component";
import { ApplicationService } from "../services/application.service";
import { NavigationService } from "../services/navigation.service";
import { TitleService } from "../services/title.service";
import { IHasNextPage } from "./has-next-page.interface";
import { GovukRequiredDirective } from "../components/required.directive";

@Component({ template: ''})
export abstract class BaseComponent implements CanActivate {

  summaryError?: QueryList<GovukErrorSummaryComponent>;

  returnUrl?: string;
  updateOnSave: boolean = true;
  constructor(protected router: Router, protected applicationService: ApplicationService, protected navigationService: NavigationService, protected activatedRoute: ActivatedRoute, protected titleService: TitleService) {
    this.screenReaderNotification("");
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['return'];
    });
  }

  abstract canContinue(): boolean;

  canAccess(routeSnapshot: ActivatedRouteSnapshot): boolean { return true; }
  canActivate(routeSnapshot: ActivatedRouteSnapshot) {
    if (!this.canAccess(routeSnapshot)) {
      this.navigationService.navigate(NotFoundComponent.route);
      return false;
    }

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

  @ViewChildren(GovukRequiredDirective) requiredFields?: QueryList<GovukRequiredDirective>;
  async saveAndComeBack(): Promise<any> {
    let canSave = this.requiredFieldsAreEmpty() || this.canContinue();
    this.hasErrors = !canSave;
    if (this.hasErrors) {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    } else {
      this.screenReaderNotification();
      this.navigationService.navigate(`application/${this.applicationService.model.id}`);
      await this.applicationService.updateApplication();
    }
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
    var alertContainer = document!.getElementById("hiddenAlertContainer");
    if (alertContainer) {
      alertContainer.innerHTML = message;
    }
  }

  private requiredFieldsAreEmpty() {
    return this.requiredFields?.filter(x => !x.govukRequired.model).length == this.requiredFields?.length;
  }
}
