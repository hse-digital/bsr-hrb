import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ApplicationService } from "../services/application.service";

export abstract class BaseComponent implements CanActivate {

  constructor(protected router: Router, protected applicationService: ApplicationService) { }

  abstract nextScreenRoute: string;
  abstract canContinue(): boolean;
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }

  hasErrors = false;
  saveAndContinue(): void {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.applicationService.updateLocalStorage();
      this.router.navigate([this.nextScreenRoute]);
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }
}
