import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { AddMoreSectionsComponent } from "../add-more-sections/add-more-sections.component";
import { SectionAddressComponent } from "../address/address.component";
import { SectionCheckAnswersComponent } from "../check-answers/check-answers.component";
import { SectionNameComponent } from "../name/name.component";

@Component({
  templateUrl: './other-addresses.component.html',
})
export class SectionOtherAddressesComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'other-addresses';
  static title: string = "Does the section have another address? - Register a high-rise building - GOV.UK";

  hasMoreAddressesError = false;
  hasMoreAddresses?: string;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  private previousAnswer?: string;
  private addressIndex?: number;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      this.addressIndex = query['address'];
      if (this.addressIndex) {
        this.hasMoreAddresses = this.applicationService.currentSection.Addresses.length > this.addressIndex ? 'yes' : 'no';
        this.previousAnswer = this.hasMoreAddresses;
      }
    });
  }

  updateReturnUrl() {
    if (this.hasMoreAddresses != this.previousAnswer) {
      this.returnUrl = undefined;
    }
  }

  canContinue(): boolean {
    this.hasMoreAddressesError = !this.hasMoreAddresses;
    return !this.hasMoreAddressesError;
  }

  async navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    // section has a single address
    if (this.hasMoreAddresses == 'no') {
      if (this.previousAnswer && this.hasMoreAddresses != this.previousAnswer) {
        this.applicationService.currentSection.Addresses.splice(this.addressIndex!, 1);
        this.applicationService.updateApplication();
        return navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, activatedRoute);
      }

      // user said there is only a single section in the building - go for check answers
      if (this.applicationService.model.NumberOfSections == 'one') {
        return navigationService.navigateRelative(`../${SectionCheckAnswersComponent.route}`, activatedRoute);
      }

      // user said there are two or more sections in the building
      // if the user entered more than one already, ask if there are more
      if (this.applicationService.model.Sections.length > 1) {
        return navigationService.navigateRelative(`../${AddMoreSectionsComponent.route}`, activatedRoute);
      }

      // user only entered one section so far, create a new one and navigate to floors
      var nextSection = this.applicationService.startNewSection();
      await this.applicationService.updateApplication();
      return navigationService.navigateRelative(`../${nextSection}/${SectionNameComponent.route}`, activatedRoute);
    }

    // section has more than a single address, navigate to address page
    return navigationService.navigateRelative(`${SectionAddressComponent.route}`, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService) && this.applicationService.currentSection.Addresses?.length < 5;
  }
}
