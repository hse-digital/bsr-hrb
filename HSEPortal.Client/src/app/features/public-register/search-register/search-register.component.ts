import { Component } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from "src/app/helpers/page.component";
import { ApplicationService } from "src/app/services/application.service";
import { StructureNotFoundComponent } from "../structure-not-found/structure-not-found.component";

@Component({
  templateUrl: './search-register.component.html'
})
export class SearchPublicRegisterComponent extends PageComponent<string> {
  public static title: string = 'Search register - Register a high-rise building - GOV.UK';
  public static route: string = 'search';

  errorText: string = '';

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.updateOnSave = false;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    let postcode = this.model?.replace(' ', '');
    this.hasErrors = true;

    if (!postcode) {
      this.errorText = 'Enter a postcode';
    } else if (postcode.length < 5 || postcode.length > 7) {
      this.errorText = "Enter a full postcode. For example, 'L20 7HS";
    } else {
      this.hasErrors = false;
    }

    return !this.hasErrors;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(StructureNotFoundComponent.route, this.activatedRoute, undefined, { postcode: this.model });
  }

}