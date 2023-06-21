import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';

import { InsulationLayerComponent } from 'src/app/features/kbi/4-roof/insulation-layer/insulation-layer.component';

let component: InsulationLayerComponent;
let fixture: ComponentFixture<InsulationLayerComponent>;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('InsulationLayerComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InsulationLayerComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(InsulationLayerComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the RoofInsulation is empty.', strategy: '' },
        { description: 'should show an error when the RoofInsulation is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                await setup(applicationService);
                applicationService.currentKbiSection!.Roof.RoofInsulation = value;
                component.hasErrors = !component.canContinue();

                expect(component.roofInsulationHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the RoofInsulation is defined and not empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Roof.RoofInsulation = value;
            component.hasErrors = !component.canContinue();
            expect(component.roofInsulationHasErrors).toBeFalse();

        }, "yes-top", "yes-below" ).execute();

});