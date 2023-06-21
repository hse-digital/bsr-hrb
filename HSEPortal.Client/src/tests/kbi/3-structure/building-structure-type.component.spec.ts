import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';

import { KbiService } from 'src/app/services/kbi.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BuildingStructureTypeComponent } from 'src/app/features/kbi/3-structure/building-structure-type/building-structure-type.component';


let component: BuildingStructureTypeComponent;
let fixture: ComponentFixture<BuildingStructureTypeComponent>;
let httpTestingController: HttpTestingController;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('BuildingStructureTypeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BuildingStructureTypeComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        
        
        httpTestingController = TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(BuildingStructureTypeComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string[] }[] = [
        { description: 'should show an error when the BuildingStructureType is empty.', strategy: [] },
        { description: 'should show an error when the BuildingStructureType is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                await setup(applicationService);
                applicationService.currentKbiSection!.BuildingStructure.BuildingStructureType = value;
                component.hasErrors = !component.canContinue();

                expect(component.buildingStructureTypeHasErrors).toBeTrue();

            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the OnsiteEnergyGeneration is defined and not empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.BuildingStructure.BuildingStructureType = value;
            component.hasErrors = !component.canContinue();
            expect(component.buildingStructureTypeHasErrors).toBeFalse();
            
        }, ["composite_steel_concrete", "concrete_large_panels_1960", "modular_concrete"], ["concrete_other", "Masonry", "steel_frame"] ).execute();

});
