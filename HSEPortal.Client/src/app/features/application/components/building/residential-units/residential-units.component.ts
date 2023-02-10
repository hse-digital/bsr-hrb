import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "../../../../../services/application.service";
import { CaptionService } from "../../../../../services/caption.service";

@Component({
  templateUrl: './residential-units.component.html'
})
export class ResidentialUnitsComponent extends BaseComponent {
  static route: string = 'residential-units';
  private blockId!: string;

  constructor(router: Router, activatedRoute: ActivatedRoute, private captionService: CaptionService, private applicationService: ApplicationService) {
    super(router, activatedRoute);
    this.blockId = this.getURLParam('blockId');
  }

  nextScreenRoute: string = '';
  building: { residentialUnits ?: string} = {};
  residentialUnitsHasErrors = false;

  errorSummaryMessage: string = 'You must enter the number of residential units in this block';
  errorMessage: string = 'Enter the number of residential units in this block';

  canContinue(): boolean {
    this.residentialUnitsHasErrors = true;
    let residentialUnits = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.ResidentialUnits;

    if (!residentialUnits) {
      this.errorMessage = 'Enter the number of residential units in this block';
      this.errorSummaryMessage = 'You must enter the number of residential units in this block';
    } else if (!Number.isInteger(Number(residentialUnits)) || Number(residentialUnits) % 1 != 0 || Number(residentialUnits) < 0) {
      this.errorSummaryMessage = this.errorMessage = 'Number of residential units must be a whole number';
    } else if (residentialUnits >= 10000) {
      this.errorSummaryMessage = this.errorMessage = 'Number of residential units must be 9999 or less';
    } else {
      this.residentialUnitsHasErrors = false;
    }
    return !this.residentialUnitsHasErrors;
  }

  override navigateNextScreenRoute() {
    this.router.navigate(['../people-living-in-building'], { relativeTo: this.activatedRoute })
  }

  updateNumberResidentialUnits(numberResidentialUnits: number) { 
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if (block) block.ResidentialUnits = numberResidentialUnits;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }
}
