import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddedFloorsTypeComponent } from 'src/app/features/kbi/7-building-use/added-floors-type/added-floors-type.component';
import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';
import { TestHelper } from 'src/tests/test-helper';

let component: AddedFloorsTypeComponent;
let fixture: ComponentFixture<AddedFloorsTypeComponent>;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('AddedFloorsTypeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddedFloorsTypeComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();

        fixture = TestBed.createComponent(AddedFloorsTypeComponent);
        component = fixture.componentInstance;
    });

    new TestHelper()
        .setDescription('should NOT show an error when AddedFloorsType is valid.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.BuildingUse.AddedFloorsType = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, ["composite_steel_concrete", "concrete_large_panels_1960", "concrete_large_panels_1970", "modular_concrete"], ["concrete_other", "lightweight_metal", "modular_steel"]).execute();

    new TestHelper()
        .setDescription('should show an error when AddedFloorsType is empty or undefined.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.BuildingUse.AddedFloorsType = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, [], undefined).execute();

});

