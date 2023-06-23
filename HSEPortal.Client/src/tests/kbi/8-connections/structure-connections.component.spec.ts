import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { StructureConnectionsComponent } from 'src/app/features/kbi/8-connections/structure-connections/structure-connections.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

let component: StructureConnectionsComponent;
let fixture: ComponentFixture<StructureConnectionsComponent>;
let httpTestingController: HttpTestingController;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [
        { Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] },
        { Name: "Section2", Addresses: [{ Postcode: "XYZ", IsManual: true }] }
    ];

    applicationService.initKbi();
    await component.ngOnInit();

    fixture.detectChanges();
}

describe('StructureConnectionsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StructureConnectionsComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();

        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(StructureConnectionsComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription('should show an error when the StructureConnections is undefined or empty.')
        .setTestCase( async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.model.Kbi!.Connections.StructureConnections = value;
            component.hasErrors = !component.canContinue();
            expect(component.structureConnectionsHasErrors).toBeTrue();

            httpTestingController.match(`api/SyncKbiStructureRoofStaircasesAndWalls/${applicationService.model.id}`);
            httpTestingController.verify();

        }, undefined, []).execute();

    new TestHelper()
        .setDescription('should NOT show an error when the StructureConnections is defined and not empty.')
        .setTestCase( async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.model.Kbi!.Connections.StructureConnections = value;
            component.hasErrors = !component.canContinue();
            expect(component.structureConnectionsHasErrors).toBeFalse();

            httpTestingController.match(`api/SyncKbiStructureRoofStaircasesAndWalls/${applicationService.model.id}`);
            httpTestingController.verify();

        }, ["bridge-walkway", "car-park", "ground-floor"], ["levels-below-ground-residential-unit", "shared-wall-emergency-door", "shared-wall-no-door"]).execute();

});

