import { Router } from "@angular/router";

export abstract class BaseFormComponent {

  constructor(protected router: Router) { }

  abstract nextScreenRoute: string;
  abstract canContinue(): boolean;

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
