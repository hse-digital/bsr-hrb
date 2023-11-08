import { Component } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from "src/app/helpers/page.component";
import { ApplicationService } from "src/app/services/application.service";

@Component({
  templateUrl: './ap-change-check-answers.component.html'
})
export class ApChangeCheckAnswersComponent extends PageComponent<void> {
  static route: string = 'ap-changes';
  static title: string = 'Check your answers about accountable persons - Register a high-rise building - GOV.UK';

  override onInit(applicationService: ApplicationService): void | Promise<void> {
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    throw new Error("Method not implemented.");
  }
  
  override navigateNext(): Promise<boolean | void> {
    throw new Error("Method not implemented.");
  }

}