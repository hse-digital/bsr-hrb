import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { LiftsComponent } from 'src/app/features/kbi/1-fire/lifts/lifts.component';


import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: LiftsComponent;
let fixture: ComponentFixture<LiftsComponent>;

function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(LiftsComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    applicationService.model.Kbi!.KbiSections[0].Fire = { };
    applicationService._currentKbiSectionIndex = 0;

    fixture.detectChanges();
}

describe('LiftsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LiftsComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    new TestHelper()
        .setDescription('should NOT show an error when Lifts is valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Fire.Lifts = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, "evacuation", "firefighters", "fire-fighting", "modernised", "firemen").execute();

    new TestHelper()
        .setDescription('should show an error when Lifts is empty or undefined.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Fire.Lifts = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, "", undefined).execute();

});

