import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { FireSmokeProvisionsComponent } from 'src/app/features/kbi/1-fire/fire-smoke-provisions/fire-smoke-provisions.component';


import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: FireSmokeProvisionsComponent;
let fixture: ComponentFixture<FireSmokeProvisionsComponent>;

function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(FireSmokeProvisionsComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    applicationService.model.Kbi!.KbiSections[0].Fire = { };
    applicationService._currentKbiSectionIndex = 0;

    fixture.detectChanges();
}

describe('FireSmokeProvisionsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FireSmokeProvisionsComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    new TestHelper()
        .setDescription('should NOT show an error when FireSmokeProvisions is valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Fire.FireSmokeProvisions = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, ["alarm_heat_smoke", "alarm_call_points", "fire_dampers"], ["fire_extinguishers"], ["fire_shutters", "heat_detectors", "risers_dry"] ).execute();

    new TestHelper()
        .setDescription('should show an error when FireSmokeProvisions is empty or undefined.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Fire.FireSmokeProvisions = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, [], undefined ).execute();

});