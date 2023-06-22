import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from 'src/tests/test-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { CertificatesYearChangeComponent } from 'src/app/features/kbi/7-building-use/certificates-year-change/certificates-year-change.component';

let component: CertificatesYearChangeComponent;
let fixture: ComponentFixture<CertificatesYearChangeComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();
    
    fixture.detectChanges();
}

describe('CertificatesYearChangeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CertificatesYearChangeComponent,],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();        

        fixture = TestBed.createComponent(CertificatesYearChangeComponent);
        component = fixture.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError: { description: string, year?: number[] }[] = [
        { description: 'should show an error when the YearChangeInUse is undefined.', year: undefined },
        { description: 'should show an error when the YearChangeInUse is a negative number.', year: [-1990, -1 ] },
        { description: 'should show an error when the YearChangeInUse does not have 4 digits.', year: [11, 123456, 123] },
        { description: 'should show an error when the YearChangeInUse is not a whole number.', year: [199.0, 1990.2, 1.990] },
    ];

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentKbiSection!.BuildingUse.YearChangeInUse = value;
                component.hasErrors = !component.canContinue();
                expect(component.certificatesYearChangesHasErrors).toBeTrue();
            }, test.year).execute();
    });

    new TestHelper()
        .setDescription('should show an error when the YearChangeInUse is equal than the YearOfCompletion.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection!.YearOfCompletion = `${value}`;
            applicationService.currentKbiSection!.BuildingUse.YearChangeInUse = value;
            component.hasErrors = !component.canContinue();
            expect(component.certificatesYearChangesHasErrors).toBeTrue();

        }, 1990, 2015, 1000).execute();

    new TestHelper()
        .setDescription('should show an error when the YearChangeInUse is lower than the YearOfCompletion.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection!.YearOfCompletion = `${value + 1}`;
            applicationService.currentKbiSection!.BuildingUse.YearChangeInUse = value;
            component.hasErrors = !component.canContinue();
            expect(component.certificatesYearChangesHasErrors).toBeTrue();

        }, 1990, 2015, 1000).execute();

    new TestHelper()
        .setDescription('should NOT show an error when the YearChangeInUse is defined and not empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection!.YearOfCompletion = `${value - 1}`;
            applicationService.currentKbiSection!.BuildingUse.YearChangeInUse = value;
            component.hasErrors = !component.canContinue();
            expect(component.certificatesYearChangesHasErrors).toBeFalse();

        }, 1990, 2015, 1000).execute();

});

