import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { RoofMaterialComponent } from 'src/app/features/kbi/4-roof/roof-material/roof-material.component';

let component: RoofMaterialComponent;
let fixture: ComponentFixture<RoofMaterialComponent>;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('RoofMaterialComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RoofMaterialComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(RoofMaterialComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the RoofMaterial is empty.', strategy: '' },
        { description: 'should show an error when the RoofMaterial is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                await setup(applicationService);
                applicationService.currentKbiSection!.Roof.RoofMaterial = value;
                component.hasErrors = !component.canContinue();

                expect(component.roofMaterialHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the RoofMaterial is defined and not empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Roof.RoofMaterial = value;
            component.hasErrors = !component.canContinue();
            expect(component.roofMaterialHasErrors).toBeFalse();

        }, "composite-panels", "fibre-cement", "metal-sheet", "plastic-sheet", "polycarbonate-sheet", "other-sheet-material", "rolled-liquid-bitumen-felt", "rolled-liquid-other-felt" ).execute();

});

