import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { TotalStaircasesComponent } from '../../5-staircases/total-staircases/total-staircases.component';
import { KbiStaircasesModule } from '../../5-staircases/kbi.staircases.module';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-roof-material',
  templateUrl: './roof-material.component.html'
})
export class RoofMaterialComponent  extends PageComponent<string> {
  static route: string = 'roof-material';
  static title: string = "Roof covering - Register a high-rise building - GOV.UK";

  roofMaterialHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentKbiSection!.Roof.RoofMaterial;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Roof.RoofMaterial = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Roof.RoofInsulation;
  }

  override isValid(): boolean {
    this.roofMaterialHasErrors = !this.model;
    return !this.roofMaterialHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../${KbiStaircasesModule.baseRoute}/${TotalStaircasesComponent.route}`, this.activatedRoute);
  }
  
  getErrorMessage(){
    return `Select what material covers the largest surface area on ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
