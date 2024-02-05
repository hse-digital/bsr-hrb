import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, RegisteredStructureModel } from 'src/app/services/application.service';
import { ApplicationCompletedComponent } from '../../application-completed/application-completed.component';

@Component({
  selector: 'hse-safety-case-report-declaration',
  templateUrl: './safety-case-report-declaration.component.html'
})
export class SafetyCaseReportDeclarationComponent extends PageComponent<void> {
  static route: string = "declaration";
  static title: string = "Declaration - Register a high-rise building - GOV.UK";

  addressIndex?: number;
  registeredStructure?: RegisteredStructureModel;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {

  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.SafetyCaseReport!.declaration = true;
    await this.applicationService.updateSafetyCaseReportDeclaration(this.applicationService.model.id!, this.applicationService.model.SafetyCaseReport!.date!);
  }

  override canAccess(applicationService: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../${ApplicationCompletedComponent.route}`, this.activatedRoute);
  }
}
