import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { cpuUsage } from 'process';
import { ComponentsModule } from 'src/app/components/components.module';
import { FireSmokeProvisionLocationsComponent } from 'src/app/features/kbi/1-fire/fire-smoke-provision-locations/fire-smoke-provision-locations.component';
import { FeatureMaterialsOutsideComponent } from 'src/app/features/kbi/6-walls/feature-materials-outside/feature-materials-outside.component';

import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: FeatureMaterialsOutsideComponent;
let fixture: ComponentFixture<FeatureMaterialsOutsideComponent>;

async function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(FeatureMaterialsOutsideComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.NumberOfSections = "one";
    applicationService.model.BuildingName = "MyBuildingName";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];
    
    applicationService.initKbi();
    applicationService.model.Kbi!.KbiSections[0]!.Walls.ExternalFeatures = ["advertising", "balconies", "communal_recreation_area", "communal_walkway", "phone_masts", "roof_lights", "solar_shading"];
    applicationService.model.Kbi!.KbiSections[0]!.Walls.FeatureMaterialsOutside = {};

    component.ngOnInit();
    component.currentFeature = "balconies";
}

describe('FeatureMaterialsOutsideComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FireSmokeProvisionLocationsComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    type TestCase = { feature: string, outside: string[] }

    let testCases: TestCase[] = [
        { feature: "balconies", outside: ["aluminium", "concrete"] },
        { feature: "roof_lights", outside: ["glass"] },
        { feature: "solar_shading", outside: [ "metal", "plastic"] },
    ];

    new TestHelper()
        .setDescription('should NOT show an error when FeatureMaterialsOutside is valid.')
        .setTestCase((applicationService: ApplicationService, value: TestCase) => {
            setup(applicationService);
            component.currentFeature = value.feature;
            applicationService.model.Kbi!.KbiSections[0]!.Walls.FeatureMaterialsOutside![value.feature] = value.outside;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, ...testCases).execute();

    new TestHelper()
        .setDescription('should show an error when FeatureMaterialsOutside is empty or undefined.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.currentFeature = "balconies";            
            applicationService.model.Kbi!.KbiSections[0]!.Walls.FeatureMaterialsOutside![component.currentFeature] = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, []).execute();

});