import { Component, Injector, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { GetInjector } from "./injector.helper";
import { AccountablePersonModel, ApplicationService, BuildingApplicationStatus, BuildingRegistrationModel, KbiSectionModel, SectionModel } from "../services/application.service";
import { GovukErrorSummaryComponent } from "hse-angular";
import { TitleService } from "../services/title.service";
import { GovukRequiredDirective } from "../components/required.directive";
import { NavigationService } from "../services/navigation.service";
import { NotFoundComponent } from "../components/not-found/not-found.component";

@Component({ template: '' })
export abstract class PageComponent<T> implements CanActivate, OnInit {
    model?: T;
    processing: boolean = false;
    hasErrors: boolean = false;

    private injector: Injector = GetInjector();
    private applicationService: ApplicationService = this.injector.get(ApplicationService);
    protected titleService: TitleService = this.injector.get(TitleService);
    protected navigationService: NavigationService = this.injector.get(NavigationService);

    @ViewChildren(GovukRequiredDirective)
    private requiredFields?: QueryList<GovukRequiredDirective>;
    private summaryError?: QueryList<GovukErrorSummaryComponent>;

    abstract onInit(applicationService: ApplicationService): void;
    abstract onSave(applicationService: ApplicationService): Promise<void>;
    abstract canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean;
    abstract isValid(): boolean;
    abstract navigateNext(): Promise<boolean>;

    constructor(protected activatedRoute: ActivatedRoute) {
        this.triggerScreenReaderNotification("");
    }

    ngOnInit(): void {
        this.onInit(this.applicationService);
    }

    get applicationModel(): BuildingRegistrationModel { return this.applicationService.model; }

    get currentAccountablePerson(): AccountablePersonModel { return this.applicationService.currentAccountablePerson; }
    get currentAccountablePersonIndex(): number { return this.applicationService._currentAccountablePersonIndex; }

    get currentSection(): SectionModel { return this.applicationService.currentSection; }
    get currentSectionIndex(): number { return this.applicationService._currentSectionIndex; }

    get currentKbiSection(): KbiSectionModel | undefined { return this.applicationService.currenKbiSection; }
    get currentKbiSectionIndex(): number { return this.applicationService._currentKbiSectionIndex; }

    async saveAndContinue(): Promise<void> {
        this.processing = true;

        this.hasErrors = !this.isValid();
        if (!this.hasErrors) {
            this.triggerScreenReaderNotification();
            await this.saveAndUpdate();

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
            await this.saveAndUpdate();
            await this.navigateBack();
        } else {
            this.focusAndUpdateErrors();
        }

        this.processing = false;
    }

    canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (!this.canAccess(this.applicationService, route)) {
            this.navigationService.navigate(NotFoundComponent.route);
            return false;
        }

        return true;
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

    private navigateBack(): Promise<boolean> {
        let route = (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete
            ? `application/${this.applicationService.model.id}/kbi`
            : `application/${this.applicationService.model.id}`;

        return this.navigationService.navigate(route);
    }

    private async saveAndUpdate(): Promise<void> {
        await this.onSave(this.applicationService);
        await this.applicationService.updateApplication();
    }

    private focusAndUpdateErrors() {
        this.summaryError?.first?.focus();
        this.titleService.setTitleError();
    }
}