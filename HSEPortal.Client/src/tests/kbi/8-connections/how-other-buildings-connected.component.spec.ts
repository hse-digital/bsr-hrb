import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { HowOtherBuildingsConnectedComponent } from 'src/app/features/kbi/8-connections/how-other-buildings-connected/how-other-buildings-connected.component';

let component: HowOtherBuildingsConnectedComponent;
let fixture: ComponentFixture<HowOtherBuildingsConnectedComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    component.ngOnInit();
    
    fixture.detectChanges();
}

describe('HowOtherBuildingsConnectedComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HowOtherBuildingsConnectedComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(HowOtherBuildingsConnectedComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription('should show an error when the HowOtherBuildingAreConnected is undefined or empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.Connections.HowOtherBuildingAreConnected = value;
            component.hasErrors = !component.canContinue();
            expect(component.howBuildingsAreConnectedHasErrors).toBeTrue();

        }, undefined, []).execute();

    new TestHelper()
        .setDescription('should NOT show an error when the HowOtherBuildingAreConnected is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.Connections.HowOtherBuildingAreConnected = value;
            component.hasErrors = !component.canContinue();
            expect(component.howBuildingsAreConnectedHasErrors).toBeFalse();

        },  ["bridge-walkway", "car-park", "ground-floor"], ["levels-below-ground-residential-unit", "shared-wall-emergency-door", "shared-wall-no-door"]).execute();

});