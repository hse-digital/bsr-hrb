import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-keep-structure-declaration',
  templateUrl: './keep-structure-declaration.component.html'
})
export class KeepStructureDeclarationComponent extends PageComponent<void> {
  static route: string = "keep-structure-declaration";
  static title: string = "Keep structure in your application - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> { 
    this.getPapName();
  }

  override async onSave(applicationService: ApplicationService): Promise<void> { }

  override canAccess(applicationService: ApplicationService, __: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(KeepStructureDeclarationComponent.route, this.activatedRoute);
  }

  papName?: string;
  getPapName(): void {
    // BUG: this value is always undefined because this screen is shown before the AP screens.
    let pap = this.applicationService.model.AccountablePersons[0];
    
    if (pap.Type == 'organisation' && FieldValidations.IsNotNullOrWhitespace(pap.OrganisationName)) {
      this.papName = pap.OrganisationName;
    } else {
      if (pap.IsPrincipal == 'yes' && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactFirstName) && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactLastName)) {
        this.papName = `${this.applicationService.model.ContactFirstName} ${this.applicationService.model.ContactLastName}`;
      } else if (FieldValidations.IsNotNullOrWhitespace(pap.FirstName) && FieldValidations.IsNotNullOrWhitespace(pap.LastName)) {
        this.papName = `${pap.FirstName} ${pap.LastName}`;
      }
    }
  }

}
