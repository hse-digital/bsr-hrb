import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SecondaryUseBuildingComponent } from 'src/app/features/kbi/7-building-use/secondary-use-building/secondary-use-building.component';

import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';
import { TestHelper } from 'src/tests/test-helper';

let component: SecondaryUseBuildingComponent;
let fixture: ComponentFixture<SecondaryUseBuildingComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('SecondaryUseBuildingComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SecondaryUseBuildingComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();

        fixture = TestBed.createComponent(SecondaryUseBuildingComponent);
        component = fixture.componentInstance;
    });

    new TestHelper()
        .setDescription('should NOT show an error when SecondaryUseBuilding is valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.BuildingUse.SecondaryUseBuilding = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, ["assembly_recreation", "office", "residential_dwellings"], ["residential_institution", "other_residential_use", "shop_commercial", "other_non_residential"]).execute();

    new TestHelper()
        .setDescription('should show an error when SecondaryUseBuilding is empty or undefined.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.BuildingUse.SecondaryUseBuilding = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, [], undefined).execute();

});

