import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { UndergoneBuildingMaterialChangesComponent } from 'src/app/features/kbi/7-building-use/undergone-building-material-changes/undergone-building-material-changes.component';
import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';
import { TestHelper } from 'src/tests/test-helper';

let component: UndergoneBuildingMaterialChangesComponent;
let fixture: ComponentFixture<UndergoneBuildingMaterialChangesComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('UndergoneBuildingMaterialChangesComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UndergoneBuildingMaterialChangesComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();

        fixture = TestBed.createComponent(UndergoneBuildingMaterialChangesComponent);
        component = fixture.componentInstance;
    });

    new TestHelper()
        .setDescription('should NOT show an error when UndergoneBuildingMaterialChanges is valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.BuildingUse.UndergoneBuildingMaterialChanges = value;            
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, ["asbestos_removal", "balconies_added", "changes_residential_units", "changes_staircase_cores"], ["changes_windows", "installation_replacement_removal_fire_systems", "installation_replacement_removal_lighting"]).execute();

    new TestHelper()
        .setDescription('should show an error when UndergoneBuildingMaterialChanges is empty or undefined.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.BuildingUse.UndergoneBuildingMaterialChanges = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();

        }, []).execute();

});

