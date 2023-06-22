import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { StructureConnectionsComponent } from 'src/app/features/kbi/8-connections/structure-connections/structure-connections.component';

let component: StructureConnectionsComponent;
let fixture: ComponentFixture<StructureConnectionsComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('StructureConnectionsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StructureConnectionsComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(StructureConnectionsComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription('should show an error when the StructureConnections is undefined or empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.Connections.StructureConnections = value;
            component.hasErrors = !component.canContinue();
            expect(component.structureConnectionsHasErrors).toBeFalse();

        }, undefined, []).execute();

    new TestHelper()
        .setDescription('should NOT show an error when the StructureConnections is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.Connections.StructureConnections = value;
            component.hasErrors = !component.canContinue();
            expect(component.structureConnectionsHasErrors).toBeFalse();

        },  ["bridge-walkway", "car-park", "ground-floor"], ["levels-below-ground-residential-unit", "shared-wall-emergency-door", "shared-wall-no-door"]).execute();

});

