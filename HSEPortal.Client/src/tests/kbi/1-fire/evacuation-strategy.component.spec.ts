import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { TestHelper } from 'src/tests/test-helper';
import { EvacuationStrategyComponent } from 'src/app/features/kbi/1-fire/evacuation-strategy/evacuation-strategy.component';
import { KbiService } from 'src/app/services/kbi.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

let component: EvacuationStrategyComponent;
let fixture: ComponentFixture<EvacuationStrategyComponent>;
let httpTestingController: HttpTestingController;

async function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    await applicationService.initKbi();
    applicationService.model.Kbi!.KbiSections[0].Fire = {};
    applicationService._currentKbiSectionIndex = 0;

    fixture.detectChanges();
}

describe('EvacuationStrategyComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EvacuationStrategyComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule, HttpClientTestingModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        httpTestingController = TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(EvacuationStrategyComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the StrategyEvacuateBuilding is empty.', strategy: '' },
        { description: 'should show an error when the StrategyEvacuateBuilding is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                await setup(applicationService);
                applicationService.currentKbiSection!.Fire.StrategyEvacuateBuilding = value;
                component.hasErrors = !component.canContinue();

                httpTestingController.expectOne(`api/SyncKbiStructureStart/${applicationService.model.id}`);
                httpTestingController.verify();

                expect(component.evacuationStrategyHasErrors).toBeTrue();


            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the StrategyEvacuateBuilding is defined and not empty.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            await setup(applicationService);
            applicationService.currentKbiSection!.Fire.StrategyEvacuateBuilding = value;
            component.hasErrors = !component.canContinue();
            expect(component.evacuationStrategyHasErrors).toBeFalse();

            httpTestingController.expectOne(`api/SyncKbiStructureStart/${applicationService.model.id}`);
            httpTestingController.verify();
        }, 'Evacuation strategy').execute();

});