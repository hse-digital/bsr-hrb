import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ExternalWallInsulationPercentageComponent } from 'src/app/features/kbi/6-walls/external-wall-insulation-percentage/external-wall-insulation-percentage.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';
import { TestHelper } from 'src/tests/test-helper';

let component: ExternalWallInsulationPercentageComponent;
let fixture: ComponentFixture<ExternalWallInsulationPercentageComponent>;

async function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(ExternalWallInsulationPercentageComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.NumberOfSections = "one";
    applicationService.model.BuildingName = "MyBuildingName";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    applicationService.model.Kbi!.KbiSections[0]!.Walls.ExternalWallInsulation = {};
    applicationService.model.Kbi!.KbiSections[0]!.Walls.ExternalWallInsulation.CheckBoxSelection = ["foil_bubble_multifoil_insulation", "phenolic_foam", "eps_xps", "pur_pir_iso"];
    applicationService.model.Kbi!.KbiSections[0]!.Walls.ExternalWallInsulationPercentages = {};

    component.errors = [];
    component.ngOnInit();

    fixture.detectChanges();
}

describe('ExternalWallInsulationPercentageComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExternalWallInsulationPercentageComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, PipesModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    type TestCase = { externalMaterials: string[], percentages: { externalMaterial: string, value: number }[] }


    let testCases: TestCase[] = [
        {
            externalMaterials: ["foil_bubble_multifoil_insulation", "phenolic_foam", "eps_xps", "pur_pir_iso"], percentages:
                [{ externalMaterial: "foil_bubble_multifoil_insulation", value: 25 },
                { externalMaterial: "phenolic_foam", value: 25 },
                { externalMaterial: "eps_xps", value: 25 },
                { externalMaterial: "pur_pir_iso", value: 25 }]
        },
        {
            externalMaterials: ["foil_bubble_multifoil_insulation", "phenolic_foam"], percentages:
                [{ externalMaterial: "foil_bubble_multifoil_insulation", value: 50 },
                { externalMaterial: "phenolic_foam", value: 50 }]
        },
        {
            externalMaterials: ["foil_bubble_multifoil_insulation", "phenolic_foam", "eps_xps"], percentages:
                [{ externalMaterial: "foil_bubble_multifoil_insulation", value: 33 },
                { externalMaterial: "phenolic_foam", value: 33.5 },
                { externalMaterial: "eps_xps", value: 33.5 }]
        }
    ];

    new TestHelper()
        .setDescription('should NOT show an error when ExternalWallMaterialsPercentage is valid.')
        .setTestCase((applicationService: ApplicationService, value: TestCase) => {
            setup(applicationService);
            applicationService.currentKbiSection!.Walls.ExternalWallInsulation!.CheckBoxSelection = value.externalMaterials;
            applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages = {};
            value.percentages.forEach(x => applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![x.externalMaterial] = x.value);
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
        }, ...testCases).execute();

    type TestError = { externalMaterials: string[], percentages: { externalMaterial: string, value: number }[] }
    type TestCaseError = { description: string, test: TestError }
    let testCasesErrors: TestCaseError[] = [
        {
            description: "should show an error when there are missing percentages.",
            test: {
                externalMaterials: ["foil_bubble_multifoil_insulation", "phenolic_foam", "eps_xps", "pur_pir_iso"], percentages:
                    [{ externalMaterial: "foil_bubble_multifoil_insulation", value: 25 },
                    { externalMaterial: "phenolic_foam", value: 25 },
                    { externalMaterial: "eps_xps", value: 25 }]
            }
        },
        {
            description: "should show an error when the sum of all percentages is not 100.",
            test: {
                externalMaterials: ["foil_bubble_multifoil_insulation", "phenolic_foam"], percentages:
                    [{ externalMaterial: "foil_bubble_multifoil_insulation", value: 50 },
                    { externalMaterial: "phenolic_foam", value: 25 }]
            }
        },
        {
            description: "should show an error when there are negative percentages.",
            test: {
                externalMaterials: ["foil_bubble_multifoil_insulation", "phenolic_foam", "eps_xps"], percentages:
                    [{ externalMaterial: "foil_bubble_multifoil_insulation", value: -33 },
                    { externalMaterial: "phenolic_foam", value: 33.5 },
                    { externalMaterial: "eps_xps", value: 33.5 }]
            }
        }
    ];

    testCasesErrors.forEach( x => {
        new TestHelper()
            .setDescription(x.description)
            .setTestCase((applicationService: ApplicationService, value: TestError) => {
                setup(applicationService);

                applicationService.currentKbiSection!.Walls.ExternalWallInsulation!.CheckBoxSelection = value.externalMaterials;
                applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages = {};
                value.percentages.forEach(x => applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![x.externalMaterial] = x.value);

                component.hasErrors = !component.canContinue();
                expect(component.hasErrors).toBeTrue();

            }, x.test).execute();
    });
    

});