import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { FloorsBelowGroundLevelComponent } from 'src/app/features/kbi/7-building-use/floors-below-ground-level/floors-below-ground-level.component';


let component: FloorsBelowGroundLevelComponent;
let fixture: ComponentFixture<FloorsBelowGroundLevelComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('FloorsBelowGroundLevelComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FloorsBelowGroundLevelComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(FloorsBelowGroundLevelComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, floors: number[] }[] = [
        { description: 'should show an error when the FloorsBelowGroundLevel is a negative number.', floors: [-19, -1, -18.3 ] },
        { description: 'should show an error when the FloorsBelowGroundLevel is greater than 20.', floors: [21, 123456, 123] },
        { description: 'should show an error when the FloorsBelowGroundLevel is not a whole number.', floors: [5.5, 15.2, 0.1, 1.0001] },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: number) => {
                setup(applicationService);
                applicationService.currentKbiSection!.BuildingUse.FloorsBelowGroundLevel = value;
                component.hasErrors = !component.canContinue();
                expect(component.floorsBelowGroundLevelHasErrors).toBeTrue();
            }, ...test.floors).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the FloorsBelowGroundLevel is valid.')
        .setTestCase((applicationService: ApplicationService, value: number) => {
            setup(applicationService);
            applicationService.currentKbiSection!.BuildingUse.FloorsBelowGroundLevel = value;
            component.hasErrors = !component.canContinue();
            expect(component.floorsBelowGroundLevelHasErrors).toBeFalse();

        }, 1, 20, 15, 10, 7).execute();

});

