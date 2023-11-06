import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';
import { ApplicationService, BuildingApplicationStage, BuildingApplicationStatuscode, SectionModel } from 'src/app/services/application.service';
import { RemoveStructureComponent } from '../remove-structure/remove-structure.component';
import { DeregisterAreYouSureComponent } from '../../change-deregister/deregister-are-you-sure/deregister-are-you-sure.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

@Component({
  selector: 'hse-need-remove-withdraw',
  templateUrl: './need-remove-withdraw.component.html'
})
export class NeedRemoveWithdrawComponent extends PageComponent<SectionModel> {
  static route: string = 'need-remove-withdraw-structure';
  static title: string = "Changes you will make next - Register a high-rise building - GOV.UK";

  heading?: string;
  secondSentence?: string;
  isAppAccepted?: boolean;
  shouldRender: boolean = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.shouldRender = false;
    this.model = new ChangeBuildingSummaryHelper(this.applicationService).getSections()[this.applicationService._currentSectionIndex];
    this.isAppAccepted = await this.isApplicationAccepted();
    this.heading = this.getHeading();
    this.secondSentence = this.getSecondSentence();
    this.shouldRender = true;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {

  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    if (!this.isSingleStructure()) {
      return this.navigationService.navigateRelative(RemoveStructureComponent.route, this.activatedRoute, {
        index: this.applicationService._currentSectionIndex
      });
    }
    return this.navigationService.navigateRelative(DeregisterAreYouSureComponent.route, this.activatedRoute);
  }

  isKbiComplete() {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
  }

  isViewOne() {
    return this.isSingleStructure() && this.isAppAccepted && this.isFloorsAndHeightOutOfScope();
  }

  isViewTwo() {
    return this.isSingleStructure() && this.isAppAccepted && this.isResidentialUnitsOutOfScope();
  }

  isViewThree() {
    return this.isSingleStructure() && this.isAppAccepted && this.isPeopleLivingInBuildingOutOfScope();
  }

  isViewFour() {
    return this.isSingleStructure() && !this.isAppAccepted && this.isFloorsAndHeightOutOfScope();
  }

  isViewFive() {
    return this.isSingleStructure() && !this.isAppAccepted && this.isResidentialUnitsOutOfScope();
  }

  isViewSix() {
    return this.isSingleStructure() && !this.isAppAccepted && this.isPeopleLivingInBuildingOutOfScope();
  }

  isViewSeven() {
    return !this.isSingleStructure() && this.isFloorsAndHeightOutOfScope();
  }

  isViewEight() {
    return !this.isSingleStructure() && this.isResidentialUnitsOutOfScope();
  }

  isViewNine() {
    return !this.isSingleStructure() && this.isPeopleLivingInBuildingOutOfScope();
  }

  isFloorsAndHeightOutOfScope() {
    return this.model!.Height! < 18 && this.model!.FloorsAbove! < 7;
  } 
  
  isResidentialUnitsOutOfScope() {
    return this.model!.ResidentialUnits! < 2;
  }

  isPeopleLivingInBuildingOutOfScope() {
    return this.model?.PeopleLivingInBuilding == 'no_wont_move';
  }

  isSingleStructure() {
    return this.applicationService.model.NumberOfSections == "one";
  }

  async isApplicationAccepted() {
    let statuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
    return statuscode == BuildingApplicationStatuscode.Registered || statuscode == BuildingApplicationStatuscode.RegisteredKbiValidated;
  }

  getHeading() {
    if(this.isViewOne() || this.isViewTwo() || this.isViewThree()) {
      return `You need to remove ${this.buildingOrSectionName} from the register`;
    } else if (this.isViewFour() || this.isViewFive() || this.isViewSix()) {
      return `You need to withdraw your application for ${this.buildingOrSectionName}`;
    } else if (this.isViewSeven() || this.isViewEight() || this.isViewNine()) {
      return `You need to remove ${this.buildingOrSectionName} from your application`;
    }
    return "";
  }

  getFirstSentence() {
    if(this.isViewOne() || this.isViewFour() || this.isViewSeven()) {
      return "floorsAndHeightSentence";
    } else if (this.isViewTwo() || this.isViewFive() || this.isViewEight()) {
      return "residentialUnitsSentence";
    } else if (this.isViewThree() || this.isViewSix() || this.isViewNine()) {
      return "peopleLivingInBuildingSentence";
    }
    return "";
  }

  getSecondSentence() {
    if(this.isViewOne() || this.isViewFour() || this.isViewSeven()) {
      return this.floorsAndHeightSecondSentence;
    } else if (this.isViewTwo() || this.isViewFive() || this.isViewEight()) {
      return this.residentialUnitsSecondSentence;
    } else if (this.isViewThree() || this.isViewSix() || this.isViewNine()) {
      return this.peopleLivingInBuildingSecondSentence;
    }
    return "";
  }

  get floorsAndHeightSecondSentence() {
    return `High-rise residential buildings have at least 7 floors or are at least 18 metres in height.`;
  }

  get residentialUnitsSecondSentence() {
    return `High-rise buildings should only be on the register if they have at least 2 residential units.`;
  }

  get peopleLivingInBuildingSecondSentence() {
    return `High-rise buildings should only be on the register if you plan to allow residents to occupy it.`;
  }

  override get buildingOrSectionName() {
    let newName = this.applicationService.currentChangedSection?.SectionModel?.Name ?? "";
    let sectionName = FieldValidations.IsNotNullOrWhitespace(newName) ? newName : this.applicationService.currentSection.Name; 
    return this.applicationService.model.NumberOfSections == "one" ? this.applicationService.model.BuildingName : sectionName;
  }

}
