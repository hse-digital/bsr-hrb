import { Component, Injector, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Observable } from "rxjs";
import { ApplicationService, BuildingApplicationStatus } from "../services/application.service";
import { GovukErrorSummaryComponent } from "hse-angular";
import { TitleService } from "../services/title.service";
import { GovukRequiredDirective } from "../components/required.directive";
import { NavigationService } from "../services/navigation.service";
import { NotFoundComponent } from "../components/not-found/not-found.component";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ApplicationSubmittedHelper } from "./app-submitted-helper";
import { GetInjector } from "./injector.helper";

@Component({ template: '' })
export abstract class PageComponent<T> implements OnInit {
  model?: T;
  processing: boolean = false;
  hasErrors: boolean = false;
  updateOnSave: boolean = true;
  returnUrl?: string;
  
  private injector: Injector = GetInjector();
  protected applicationService: ApplicationService = this.injector.get(ApplicationService);
  protected titleService: TitleService = this.injector.get(TitleService);
  protected navigationService: NavigationService = this.injector.get(NavigationService);
  protected router: Router = this.injector.get(Router);
  protected activatedRoute: ActivatedRoute = this.injector.get(ActivatedRoute);

  @ViewChildren(GovukRequiredDirective) private requiredFields?: QueryList<GovukRequiredDirective>;
  @ViewChildren("summaryError") private summaryError?: QueryList<GovukErrorSummaryComponent>;

  abstract onInit(applicationService: ApplicationService): Promise<void> | void;
  abstract onSave(applicationService: ApplicationService): Promise<void> | void;
  abstract canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean;
  abstract isValid(): boolean;
  abstract navigateNext(): Promise<boolean | void>;


  constructor() {
    this.triggerScreenReaderNotification("");
  }

  async ngOnInit() {
    await this.onInit(this.applicationService);
  }

  async saveAndContinue(): Promise<void> {
    this.processing = true;

    this.hasErrors = !this.isValid();
    if (!this.hasErrors) {
      this.triggerScreenReaderNotification();
      this.applicationService.updateLocalStorage();
      if (this.updateOnSave) {
        await this.saveAndUpdate();
      }

      if (this.returnUrl) {
        let returnUri = this.returnUrl == 'check-answers' ? `../${this.returnUrl}` : this.returnUrl;
        this.navigationService.navigateRelative(returnUri, this.activatedRoute);
        return;
      }

      let navigationSucceeded = await this.navigateNext();
      if (!navigationSucceeded) {
        await this.navigationService.navigate(NotFoundComponent.route);
      }
    } else {
      this.focusAndUpdateErrors();
    }

    this.processing = false;
  }

  async saveAndComeBack(): Promise<void> {
    this.processing = true;
    let canSave = this.requiredFieldsAreEmpty() || this.isValid();
    this.hasErrors = !canSave;
    if (!this.hasErrors) {
      this.triggerScreenReaderNotification();
      this.applicationService.updateLocalStorage();
      if (this.updateOnSave) {
        await this.saveAndUpdate();
      }
      this.navigateBack();
    } else {
      this.focusAndUpdateErrors();
    }

    this.processing = false;
  }

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.canAccess(this.applicationService, route)) {
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


  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

  triggerScreenReaderNotification(message: string = "Sending success") {
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

  private navigateBack(): void {
    let route = (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete
      ? `application/${this.applicationService.model.id}/kbi`
      : `application/${this.applicationService.model.id}`;
    this.navigationService.navigate(route);
  }

  protected async saveAndUpdate(): Promise<void> {
    await this.onSave(this.applicationService);
    await this.applicationService.updateApplication();
  }

  protected focusAndUpdateErrors() {
    this.summaryError?.first?.focus();
    this.titleService.setTitleError();
  }
}
