import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { PreviousUseBuildingComponent } from 'src/app/features/kbi/7-building-use/previous-use-building/previous-use-building.component';

let component: PreviousUseBuildingComponent;
let fixture: ComponentFixture<PreviousUseBuildingComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('PreviousUseBuildingComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PreviousUseBuildingComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(PreviousUseBuildingComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, strategy?: string }[] = [
        { description: 'should show an error when the PreviousUseBuilding is empty.', strategy: '' },
        { description: 'should show an error when the PreviousUseBuilding is undefined.', strategy: undefined },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentKbiSection!.BuildingUse.PreviousUseBuilding = value;
                component.hasErrors = !component.canContinue();

                expect(component.previousUseBuildingHasErrors).toBeTrue();
            }, test.strategy).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the PreviousUseBuilding is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.BuildingUse.PreviousUseBuilding = value;
            component.hasErrors = !component.canContinue();
            expect(component.previousUseBuildingHasErrors).toBeFalse();

        }, "assembly_recreation", "office", "residential_institution", "other_residential_use", "shop_commercial", "other_non_residential").execute();

});

