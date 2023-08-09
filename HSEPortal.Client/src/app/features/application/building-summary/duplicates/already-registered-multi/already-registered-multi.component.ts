import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, AccountablePersonModel } from 'src/app/services/application.service';
import { RegisteredStructureModel, DuplicatesService } from 'src/app/services/duplicates.service';

@Component({
  selector: 'hse-already-registered-multi',
  templateUrl: './already-registered-multi.component.html',
  styleUrls: ['./already-registered-multi.component.scss']
})
export class AlreadyRegisteredMultiComponent extends PageComponent<string> {
  public static route: string = "already-registered-multi";
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
        return FieldValidations.IsNotNullOrWhitespace(postcode) ? await this.duplicatesService.GetRegisteredStructureBy(postcode!) : {};
      })
      .then(async structure => this.registeredStructure = structure);
  }

  override onSave(applicationService: ApplicationService): void | Promise<void> { }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.model == 'yes') {
      return this.navigationService.navigateRelative(AlreadyRegisteredMultiComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(AlreadyRegisteredMultiComponent.route, this.activatedRoute);
  }

  getAccountablePersonName(ap: AccountablePersonModel) {
    if (!ap) return "";
    return ap.Type == "individual" ? `${ap.FirstName} ${ap.LastName}` : ap.OrganisationName;
  }

}
