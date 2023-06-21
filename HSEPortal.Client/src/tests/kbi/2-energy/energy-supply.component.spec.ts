import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';

import { KbiService } from 'src/app/services/kbi.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnergySupplyComponent } from 'src/app/features/kbi/2-energy/energy-supply/energy-supply.component';

let component: EnergySupplyComponent;
let fixture: ComponentFixture<EnergySupplyComponent>;
let httpTestingController: HttpTestingController;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('EnergySupplyComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnergySupplyComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        
        
        httpTestingController = TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(EnergySupplyComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the EnergySupply is empty.', strategy: '' },
        { description: 'should show an error when the EnergySupply is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                await setup(applicationService);
                applicationService.currentKbiSection!.Energy.EnergySupply = value;
                component.hasErrors = !component.canContinue();

                expect(component.energySupplyHasErrors).toBeTrue();

                httpTestingController.match(`/api/UpdateApplication/${applicationService.model.id}`);
                httpTestingController.verify();

            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the EnergySupply is defined and not empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Energy.EnergySupply = value;
            component.hasErrors = !component.canContinue();
            expect(component.energySupplyHasErrors).toBeFalse();
            
            httpTestingController.match(`/api/UpdateApplication/${applicationService.model.id}`);
            httpTestingController.verify();

        }, "energy-supply-communal", "energy-supply-mains-electric", "energy-supply-oil", "energy-supply-other" ).execute();

});

