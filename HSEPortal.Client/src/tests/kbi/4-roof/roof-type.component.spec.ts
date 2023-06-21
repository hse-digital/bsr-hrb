import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { RoofTypeComponent } from 'src/app/features/kbi/4-roof/roof-type/roof-type.component';


let component: RoofTypeComponent;
let fixture: ComponentFixture<RoofTypeComponent>;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('RoofTypeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RoofTypeComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(RoofTypeComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the RoofType is empty.', strategy: '' },
        { description: 'should show an error when the RoofType is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                await setup(applicationService);
                applicationService.currentKbiSection!.Roof.RoofType = value;
                component.hasErrors = !component.canContinue();

                expect(component.roofTypeHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the RoofType is defined and not empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Roof.RoofType = value;
            component.hasErrors = !component.canContinue();
            expect(component.roofTypeHasErrors).toBeFalse();

        }, "flat-roof", "pitched-roof", "mix-flat-pitched").execute();

});

