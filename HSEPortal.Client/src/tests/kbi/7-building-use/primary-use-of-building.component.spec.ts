import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { PrimaryUseOfBuildingComponent } from 'src/app/features/kbi/7-building-use/primary-use-of-building/primary-use-of-building.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

let httpTestingController: HttpTestingController;
let component: PrimaryUseOfBuildingComponent;
let fixture: ComponentFixture<PrimaryUseOfBuildingComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('PrimaryUseOfBuildingComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PrimaryUseOfBuildingComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(PrimaryUseOfBuildingComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the PrimaryUseOfBuilding is empty.', strategy: '' },
        { description: 'should show an error when the PrimaryUseOfBuilding is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentKbiSection!.BuildingUse.PrimaryUseOfBuilding = value;
                component.hasErrors = !component.canContinue();

                expect(component.primaryUseOfBuildingHasErrors).toBeTrue();
                
                httpTestingController.match(`api/SyncKbiStructureRoofStaircasesAndWalls/${applicationService.model.id}`);
                httpTestingController.verify();

            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the PrimaryUseOfBuilding is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.BuildingUse.PrimaryUseOfBuilding = value;
            component.hasErrors = !component.canContinue();
            expect(component.primaryUseOfBuildingHasErrors).toBeFalse();

            httpTestingController.match(`api/SyncKbiStructureRoofStaircasesAndWalls/${applicationService.model.id}`);
            httpTestingController.verify();

        }, "assembly_recreation", "office", "residential_dwellings", "residential_institution", "other_residential_use").execute();

});

