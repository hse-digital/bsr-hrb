import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { OtherBuildingConnectionsComponent } from 'src/app/features/kbi/8-connections/other-building-connections/other-building-connections.component';


let component: OtherBuildingConnectionsComponent;
let fixture: ComponentFixture<OtherBuildingConnectionsComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    component.ngOnInit();
    
    fixture.detectChanges();
}

describe('OtherBuildingConnectionsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OtherBuildingConnectionsComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(OtherBuildingConnectionsComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription('should show an error when the OtherBuildingConnections is undefined or empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.Connections.OtherBuildingConnections = value;
            component.hasErrors = !component.canContinue();
            expect(component.otherBuildingConnectionsHasErrors).toBeTrue();

        }, undefined, '').execute();

    new TestHelper()
        .setDescription('should NOT show an error when the OtherBuildingConnections is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.Connections.OtherBuildingConnections = value;
            component.hasErrors = !component.canContinue();
            expect(component.otherBuildingConnectionsHasErrors).toBeFalse();

        },  "yes", "no").execute();

});