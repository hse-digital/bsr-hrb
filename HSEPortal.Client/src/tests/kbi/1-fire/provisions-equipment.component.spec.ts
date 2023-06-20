import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ProvisionsEquipmentComponent } from 'src/app/features/kbi/1-fire/provisions-equipment/provisions-equipment.component';

import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: ProvisionsEquipmentComponent;
let fixture: ComponentFixture<ProvisionsEquipmentComponent>;

function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(ProvisionsEquipmentComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    applicationService.model.Kbi!.KbiSections[0].Fire = { };
    applicationService._currentKbiSectionIndex = 0;

    fixture.detectChanges();
}

describe('ProvisionsEquipmentComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProvisionsEquipmentComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    new TestHelper()
        .setDescription('should NOT show an error when ProvisionsEquipment is valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Fire.ProvisionsEquipment = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, "heat_detectors", "smoke_detectors", "sprinklers" ).execute();

    new TestHelper()
        .setDescription('should show an error when ProvisionsEquipment is empty or undefined.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Fire.ProvisionsEquipment = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, "", undefined).execute();

});

