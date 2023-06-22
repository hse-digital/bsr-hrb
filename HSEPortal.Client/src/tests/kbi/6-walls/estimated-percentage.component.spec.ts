import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { EstimatedPercentageComponent } from 'src/app/features/kbi/6-walls/estimated-percentage/estimated-percentage.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: EstimatedPercentageComponent;
let fixture: ComponentFixture<EstimatedPercentageComponent>;

async function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(EstimatedPercentageComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.NumberOfSections = "one";
    applicationService.model.BuildingName = "MyBuildingName";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    applicationService.model.Kbi!.KbiSections[0]!.Walls.ExternalWallMaterials = ["masonry", "render", "tiles", "timber"];
    applicationService.model.Kbi!.KbiSections[0]!.Walls.ExternalWallMaterialsPercentage = {};

    component.errors = [];
    component.ngOnInit();

    fixture.detectChanges();
}

describe('EstimatedPercentageComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EstimatedPercentageComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, PipesModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    type TestCase = { externalMaterials: string[], percentages: { externalMaterial: string, value: string }[] }


    let testCases: TestCase[] = [
        {
            externalMaterials: ["masonry", "render", "tiles", "timber"], percentages:
                [{ externalMaterial: "masonry", value: "25" },
                { externalMaterial: "render", value: "25" },
                { externalMaterial: "tiles", value: "25" },
                { externalMaterial: "timber", value: "25" }]
        },
        {
            externalMaterials: ["masonry", "render"], percentages:
                [{ externalMaterial: "masonry", value: "50" },
                { externalMaterial: "render", value: "50" }]
        },
        {
            externalMaterials: ["masonry", "render", "tiles"], percentages:
                [{ externalMaterial: "masonry", value: "33" },
                { externalMaterial: "render", value: "33.5" },
                { externalMaterial: "tiles", value: "33.5" }]
        }
    ];

    new TestHelper()
        .setDescription('should NOT show an error when ExternalWallMaterialsPercentage is valid.')
        .setTestCase((applicationService: ApplicationService, value: TestCase) => {
            setup(applicationService);
            applicationService.currentKbiSection!.Walls.ExternalWallMaterials = value.externalMaterials;
            applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage = {};
            value.percentages.forEach(x => applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage![x.externalMaterial] = x.value);
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
        }, ...testCases).execute();

    type TestError = { externalMaterials: string[], percentages: { externalMaterial: string, value: string }[] }
    type TestCaseError = { description: string, test: TestError }
    let testCasesErrors: TestCaseError[] = [
        {
            description: "should show an error when there are missing percentages.",
            test: {
                externalMaterials: ["masonry", "render", "tiles", "timber"], percentages:
                    [{ externalMaterial: "masonry", value: "25" },
                    { externalMaterial: "render", value: "25" },
                    { externalMaterial: "tiles", value: "25" }]
            }
        },
        {
            description: "should show an error when the sum of all percentages is not 100.",
            test: {
                externalMaterials: ["masonry", "render"], percentages:
                    [{ externalMaterial: "masonry", value: "50" },
                    { externalMaterial: "render", value: "25" }]
            }
        },
        {
            description: "should show an error when there are negative percentages.",
            test: {
                externalMaterials: ["masonry", "render", "tiles"], percentages:
                    [{ externalMaterial: "masonry", value: "-33" },
                    { externalMaterial: "render", value: "33.5" },
                    { externalMaterial: "tiles", value: "33.5" }]
            }
        },
        {
            description: "should show an error when there are empty percentages.",
            test: {
                externalMaterials: ["masonry", "render", "tiles"], percentages:
                    [{ externalMaterial: "masonry", value: "" },
                    { externalMaterial: "render", value: "33.5" },
                    { externalMaterial: "tiles", value: "" }]
            }
        }
    ];

    testCasesErrors.forEach( x => {
        new TestHelper()
            .setDescription(x.description)
            .setTestCase((applicationService: ApplicationService, value: TestError) => {
                setup(applicationService);

                applicationService.currentKbiSection!.Walls.ExternalWallMaterials = value.externalMaterials;
                applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage = {};
                value.percentages.forEach(x => applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage![x.externalMaterial] = x.value);

                component.hasErrors = !component.canContinue();
                expect(component.hasErrors).toBeTrue();

            }, x.test).execute();
    });
    

});