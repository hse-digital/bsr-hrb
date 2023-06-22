import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { YearMostRecentChangeComponent } from 'src/app/features/kbi/7-building-use/year-most-recent-change/year-most-recent-change.component';

let component: YearMostRecentChangeComponent;
let fixture: ComponentFixture<YearMostRecentChangeComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('YearMostRecentChangeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YearMostRecentChangeComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(YearMostRecentChangeComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, year: string[] }[] = [
        { description: 'should show an error when the YearMostRecentMaterialChange is a negative number.', year: ["-1990", "-1" ] },
        { description: 'should show an error when the YearMostRecentMaterialChange does not have 4 digits.', year: ["11", "123456", "123"] },
        { description: 'should show an error when the YearMostRecentMaterialChange is not a whole number.', year: ["199.0", "1990.2", "1.990"] },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: string) => {
                setup(applicationService);
                applicationService.currentKbiSection!.BuildingUse.YearMostRecentMaterialChange = value;
                component.hasErrors = !component.canContinue();
                expect(component.hasErrors).toBeTrue();
            }, ...test.year).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the YearMostRecentMaterialChange is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentKbiSection!.BuildingUse.YearMostRecentMaterialChange = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();

        }, "1990", "2015", "1000").execute();

});

