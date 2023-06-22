import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { MostRecentChangeComponent } from 'src/app/features/kbi/7-building-use/most-recent-material-change/most-recent-material-change.component';

let component: MostRecentChangeComponent;
let fixture: ComponentFixture<MostRecentChangeComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges = ["asbestos_removal", "balconies_added", "changes_residential_units", "changes_staircase_cores"];
    
    fixture.detectChanges();
}

describe('MostRecentChangeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MostRecentChangeComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(MostRecentChangeComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the MostRecentMaterialChange is empty.', strategy: '' },
        { description: 'should show an error when the MostRecentMaterialChange is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = value;
                component.hasErrors = !component.canContinue();

                expect(component.mostRecentChangeHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the MostRecentMaterialChange is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = value;
            component.hasErrors = !component.canContinue();
            expect(component.mostRecentChangeHasErrors).toBeFalse();

        }, "asbestos_removal", "balconies_added", "changes_residential_units", "changes_staircase_cores").execute();

});

