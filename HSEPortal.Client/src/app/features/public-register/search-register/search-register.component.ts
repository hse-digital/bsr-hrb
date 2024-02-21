import { Component } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from "src/app/helpers/page.component";
import { ApplicationService } from "src/app/services/application.service";
import { StructureNotFoundComponent } from "../structure-not-found/structure-not-found.component";
import { PublicRegisterResultsComponent } from "../results/results.component";
import { StructureDetailsComponent } from "../structure-details/structure-details.component";
import { AddressService } from "src/app/services/address.service";

@Component({
  templateUrl: './search-register.component.html'
})
export class SearchPublicRegisterComponent extends PageComponent<string> {
  public static title: string = 'Search register - Register a high-rise building - GOV.UK';
  public static route: string = 'search';

  errorText: string = '';
  searching: boolean = false;

  constructor(private addressService: AddressService) {
    super();
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.updateOnSave = false;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  async search() {
    this.hasErrors = !this.isValid();
    if (!this.hasErrors) {
      this.searching = true;

      var results = [];
      var postcodeSearchResponse = await this.addressService.SearchBuildingByPostcode(this.model!);
      if (postcodeSearchResponse.TotalResults > 0) {
        var match = postcodeSearchResponse.Results[0];
        results = await this.applicationService.searchPublicRegister(match.Postcode!, match.UPRN);
      } else {
        results = await this.applicationService.searchPublicRegister(this.model!);
      }

      if (results.length > 0) {
        if (results.length == 1) {
          await this.navigationService.navigateRelative(StructureDetailsComponent.route, this.activatedRoute, undefined, { postcode: this.model, result: results[0] });
        } else {
          await this.navigationService.navigateRelative(PublicRegisterResultsComponent.route, this.activatedRoute, undefined, { postcode: this.model, "public-register-results": results });
        }
      } else {
        await this.navigationService.navigateRelative(StructureNotFoundComponent.route, this.activatedRoute, undefined, { postcode: this.model });
      }
    }
  }

  override isValid(): boolean {
    this.model = this.model?.toUpperCase();
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
  }

}