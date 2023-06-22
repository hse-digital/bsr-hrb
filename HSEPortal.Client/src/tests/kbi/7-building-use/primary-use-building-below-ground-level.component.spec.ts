import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { PrimaryUseBuildingBelowGroundLevelComponent } from 'src/app/features/kbi/7-building-use/primary-use-building-below-ground-level/primary-use-building-below-ground-level.component';

let component: PrimaryUseBuildingBelowGroundLevelComponent;
let fixture: ComponentFixture<PrimaryUseBuildingBelowGroundLevelComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('PrimaryUseBuildingBelowGroundLevelComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PrimaryUseBuildingBelowGroundLevelComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(PrimaryUseBuildingBelowGroundLevelComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the PrimaryUseBuildingBelowGroundLevel is empty.', strategy: '' },
        { description: 'should show an error when the PrimaryUseBuildingBelowGroundLevel is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentKbiSection!.BuildingUse.PrimaryUseBuildingBelowGroundLevel = value;
                component.hasErrors = !component.canContinue();

                expect(component.primaryUseBuildingBelowGroundLevelHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the PrimaryUseBuildingBelowGroundLevel is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.BuildingUse.PrimaryUseBuildingBelowGroundLevel = value;
            component.hasErrors = !component.canContinue();
            expect(component.primaryUseBuildingBelowGroundLevelHasErrors).toBeFalse();

        }, "assembly_recreation", "office", "residential_dwellings", "residential_institution", "other_residential_use").execute();

});

