import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

export abstract class BaseComponent implements CanActivate {

  constructor(protected router: Router) { }

  abstract nextScreenRoute: string;
  abstract canContinue(): boolean;
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }

  hasErrors = false;
  saveAndContinue(): void {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.router.navigate([this.nextScreenRoute]);
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

}
