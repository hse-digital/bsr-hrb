import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { NotFoundComponent } from "../components/not-found/not-found.component";
import { ApplicationService, BuildingApplicationStage } from "../services/application.service";
import { NavigationService } from "../services/navigation.service";
import { TitleService } from "../services/title.service";
import { IHasNextPage } from "./has-next-page.interface";
import { GovukRequiredDirective } from "../components/required.directive";
import { ApplicationSubmittedHelper } from "./app-submitted-helper";

@Component({ template: '' })
export abstract class BaseComponent implements CanActivate {

  summaryError?: QueryList<GovukErrorSummaryComponent>;

  returnUrl?: string;
  updateOnSave: boolean = true;
  constructor(protected router: Router, protected applicationService: ApplicationService, protected navigationService: NavigationService, protected activatedRoute: ActivatedRoute, protected titleService: TitleService) {
    this.screenReaderNotification("");
    this.activatedRoute.queryParams.subscribe((params: { [x: string]: string | undefined; }) => {
      this.returnUrl = params['return'];
    });
  }

  abstract canContinue(): boolean;

  canAccess(routeSnapshot: ActivatedRouteSnapshot): boolean { return true; }
  canActivate(routeSnapshot: ActivatedRouteSnapshot) {
    if (!this.canAccess(routeSnapshot)) {
      this.navigationService.navigate(NotFoundComponent.route);
      return false;
    } else if (!this.isSummaryPage() && !this.isKbiPage() && !this.isReturningApplicationPage() && ApplicationSubmittedHelper.isPaymentCompleted(this.applicationService)) {
      if (ApplicationSubmittedHelper.isKbiCompleted(this.applicationService)) {
        this.navigationService.navigate(ApplicationSubmittedHelper.getApplicationCompletedRoute(this.applicationService));
      } else {
        this.navigationService.navigate(ApplicationSubmittedHelper.getPaymentConfirmationRoute(this.applicationService));
      }
      return false;
    }

    return true;
  }

  private isSummaryPage() {
    return location.href.endsWith(`/${this.applicationService.model.id}/summary`);
  }

  private isKbiPage() {
    return location.href.includes(`/${this.applicationService.model.id}/kbi`);
  }

  private isReturningApplicationPage() {
    return location.href.includes(`returning-application`);
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
      await this.applicationService.updateApplication();
      let route = (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentComplete) == BuildingApplicationStage.PaymentComplete
        ? `application/${this.applicationService.model.id}/kbi`
        : `application/${this.applicationService.model.id}`;
      this.navigationService.navigate(route);
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
    return this.requiredFields?.filter(x => {
      if (Array.isArray(x.govukRequired.model)) {
        return x.govukRequired.model.length == 0;
      }

      return !x.govukRequired.model;
    }).length == this.requiredFields?.length;
  }
}
