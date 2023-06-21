import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';

import { KbiService } from 'src/app/services/kbi.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExternalWallInsulationTypeComponent } from 'src/app/features/kbi/6-walls/external-wall-insulation-type/external-wall-insulation-type.component';

let component: ExternalWallInsulationTypeComponent;
let fixture: ComponentFixture<ExternalWallInsulationTypeComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('ExternalWallInsulationTypeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExternalWallInsulationTypeComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        
        
        fixture = TestBed.createComponent(ExternalWallInsulationTypeComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription('should show an error when the ExternalWallInsulation is empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Walls.ExternalWallInsulation = {};
            applicationService.currentKbiSection!.Walls.ExternalWallInsulation.CheckBoxSelection = value;
            
            component.hasErrors = !component.canContinue();
            expect(component.externalWallInsulationTypeHasErrors).toBeTrue();            
        }, []).execute();

    new TestHelper()
        .setDescription('should show an error when the user selection contains "other" but the other text is empty')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Walls.ExternalWallInsulation = {};
            applicationService.currentKbiSection!.Walls.ExternalWallInsulation.CheckBoxSelection = ['other'];
            applicationService.currentKbiSection!.Walls.ExternalWallInsulation.OtherValue = value;
            
            component.hasErrors = !component.canContinue();
            expect(component.externalWallInsulationTypeHasErrors).toBeTrue();            
        }, "").execute();

    new TestHelper()
        .setDescription('should NOT show an error when the ExternalWallInsulation is defined and not empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Walls.ExternalWallInsulation = {};
            applicationService.currentKbiSection!.Walls.ExternalWallInsulation.CheckBoxSelection = value;
            component.hasErrors = !component.canContinue();
            expect(component.externalWallInsulationTypeHasErrors).toBeFalse();
            
        }, ["fibre_glass_mineral_wool", "fibre_wood_sheep_wool"], ["foil_bubble_multifoil_insulation", "phenolic_foam", "eps_xps"], ["pur_pir_iso"] ).execute();

});

