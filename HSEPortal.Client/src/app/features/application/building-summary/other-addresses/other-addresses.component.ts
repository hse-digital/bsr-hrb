import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { AddMoreSectionsComponent } from "../add-more-sections/add-more-sections.component";
import { SectionAddressComponent } from "../address/address.component";
import { SectionCheckAnswersComponent } from "../check-answers/check-answers.component";
import { SectionNameComponent } from "../name/name.component";
import { PageComponent } from "src/app/helpers/page.component";
import { NotNeedRegisterMultiDuplicatedStructuresComponent } from "../duplicates/not-reg-multi-dupli-struct/not-register-multi-dupli-structures.component";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { BuildingChangeCheckAnswersComponent } from "src/app/features/registration-amendments/change-building-summary/building-change-check-answers/building-change-check-answers.component";

@Component({
  templateUrl: './other-addresses.component.html',
})
export class SectionOtherAddressesComponent extends PageComponent<string> {
  static route: string = 'other-addresses';
  static title: string = "Does the section have another address? - Register a high-rise building - GOV.UK";

  private previousAnswer?: string;
  private addressIndex?: number;

  hasMoreAddressesError = false;
  hasMoreAddresses?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  updateReturnUrl() {
    if (this.hasMoreAddresses != this.previousAnswer) {
      this.returnUrl = undefined;
    }
  }

  override onInit(applicationService: ApplicationService): void {
    this.activatedRoute.queryParams.subscribe(query => {
      this.addressIndex = query['address'];
      if (this.addressIndex) {
        this.hasMoreAddresses = this.applicationService.currentSection.Addresses.length > this.addressIndex ? 'yes' : 'no';
        this.previousAnswer = this.hasMoreAddresses;
      }
    });
  }

  override async onSave(applicationService: ApplicationService): Promise<void> { }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService) && (this.applicationService.currentSection.Addresses?.length ?? 0) <= 5;
  }

  override isValid(): boolean {
    this.hasMoreAddressesError = !this.hasMoreAddresses;
    return !this.hasMoreAddressesError;
  }

  override async navigateNext(): Promise<boolean> {
    // section has a single address
    if (this.hasMoreAddresses == 'no') {

      if (this.changing) return this.navigationService.navigateRelative(`../../registration-amendments/${BuildingChangeCheckAnswersComponent.route}`, this.activatedRoute);

      if (this.previousAnswer && this.hasMoreAddresses != this.previousAnswer) {
        this.applicationService.currentSection.Addresses.splice(this.addressIndex!, 1);
        this.applicationService.updateApplication();
        return this.navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, this.activatedRoute);
      }

      // user said there is only a single section in the building - go for check answers
      if (this.applicationService.model.NumberOfSections == 'one') {
        let areAllStructuresIncluded = this.applicationService.currentVersion.Sections.every(x => !!x.Duplicate?.IncludeStructure && x.Duplicate?.IncludeStructure == 'no');
        if (areAllStructuresIncluded) {
          this.navigationService.navigateRelative(`../${NotNeedRegisterMultiDuplicatedStructuresComponent.route}`, this.activatedRoute);
        }
        return this.navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, this.activatedRoute);
      }

      // user said there are two or more sections in the building
      // if the user entered more than one already, ask if there are more
      if (this.applicationService.currentVersion.Sections.length > 1) {
        return this.navigationService.navigateRelative(`../${AddMoreSectionsComponent.route}`, this.activatedRoute);
      }

      // user only entered one section so far, create a new one and navigate to floors
      var nextSection = this.applicationService.startNewSection();
      await this.applicationService.updateApplication();
      return this.navigationService.navigateRelative(`../${nextSection}/${SectionNameComponent.route}`, this.activatedRoute);
    }

    // section has more than a single address, navigate to address page
    return this.navigationService.navigateRelative(`${SectionAddressComponent.route}`, this.activatedRoute, {
      address: this.applicationService.currentSection.Addresses.length + 1
    });
  }
}
