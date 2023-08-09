import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';
import { DuplicatesService, RegisteredStructureModel } from 'src/app/services/duplicates.service';

@Component({
  selector: 'hse-already-registered-single',
  templateUrl: './already-registered-single.component.html'
})
export class AlreadyRegisteredSingleComponent extends PageComponent<void> {
  public static route: string = "already-registered-single";
  public static title: string = "This building has already been registered - Register a high-rise building - GOV.UK";

  registeredStructure?: RegisteredStructureModel;

  constructor(private duplicatesService: DuplicatesService) {
    super();
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.registeredStructure = {};
    await firstValueFrom(this.activatedRoute.params)
      .then(async param => param['address'])
      .then(async addressIndex => {
        let postcode = this.applicationService.currentSection.Addresses[addressIndex ?? 0].Postcode;
        let addressLineOne = this.applicationService.currentSection.Addresses[addressIndex ?? 0].Address;
        return FieldValidations.IsNotNullOrWhitespace(postcode) ? await this.duplicatesService.GetRegisteredStructureBy(postcode!, addressLineOne!) : {};
      })
      .then(async structure => this.registeredStructure = structure);
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> { }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    throw new Error('Method not implemented.');
  }

  getAccountablePersonName(ap: AccountablePersonModel) {
    if(!ap) return "";
    return ap.Type == "individual" ? `${ap.FirstName} ${ap.LastName}`: ap.OrganisationName;
  }

}
