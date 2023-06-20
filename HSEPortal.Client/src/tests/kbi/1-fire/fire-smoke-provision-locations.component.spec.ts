import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { FireSmokeProvisionLocationsComponent } from 'src/app/features/kbi/1-fire/fire-smoke-provision-locations/fire-smoke-provision-locations.component';

import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: FireSmokeProvisionLocationsComponent;
let fixture: ComponentFixture<FireSmokeProvisionLocationsComponent>;

function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(FireSmokeProvisionLocationsComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    applicationService.model.Kbi!.KbiSections[0].Fire = {};
    applicationService._currentKbiSectionIndex = 0;

    applicationService.model.Kbi!.KbiSections[0]!.Fire.FireSmokeProvisions = ["alarm_heat_smoke", "fire_dampers", "heat_detectors"];

    fixture.detectChanges();
}

describe('FireSmokeProvisionLocationsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FireSmokeProvisionLocationsComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    type TestCase = { provision: string, locations: string[] }

    let testCases: TestCase[] = [
        { provision: "alarm_heat_smoke", locations: ["basement", "bin_store", "car_park"] },
        { provision: "fire_dampers", locations: ["common_balcony"] },
        { provision: "heat_detectors", locations: ["common_corridor", "common_staircase", "external_staircase", "bin_store"] },
    ];


    new TestHelper()
        .setDescription('should NOT show an error when FireSmokeProvisions is valid.')
        .setTestCase((applicationService: ApplicationService, value: TestCase) => {
            setup(applicationService);
            component.currentEquipment = value.provision;
            
            applicationService.model.Kbi!.KbiSections[0]!.Fire.FireSmokeProvisionLocations![value.provision] = value.locations;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, ...testCases).execute();

    new TestHelper()
        .setDescription('should show an error when FireSmokeProvisions is empty or undefined.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);

            component.currentEquipment = "fire_dampers";            
            applicationService.model.Kbi!.KbiSections[0]!.Fire.FireSmokeProvisionLocations!["fire_dampers"] = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, [], undefined).execute();

});
