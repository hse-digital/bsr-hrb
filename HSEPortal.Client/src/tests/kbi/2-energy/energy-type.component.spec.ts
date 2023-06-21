import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { EnergyTypeComponent } from 'src/app/features/kbi/2-energy/energy-type/energy-type.component';


import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: EnergyTypeComponent;
let fixture: ComponentFixture<EnergyTypeComponent>;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('EnergyTypeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnergyTypeComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();

        fixture = TestBed.createComponent(EnergyTypeComponent);
        component = fixture.componentInstance;
    });

    new TestHelper()
        .setDescription('should NOT show an error when EnergyTypeStorage is valid.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Energy.EnergyTypeStorage = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, ["hydrogen_batteries", "lithium_ion_batteries"], ["lithium_ion_batteries"]).execute();

    new TestHelper()
        .setDescription('should show an error when EnergyTypeStorage is empty or undefined.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Energy.EnergyTypeStorage = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, [], undefined).execute();

});

