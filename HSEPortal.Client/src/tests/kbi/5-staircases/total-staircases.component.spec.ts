import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { TotalStaircasesComponent } from 'src/app/features/kbi/5-staircases/total-staircases/total-staircases.component';

import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: TotalStaircasesComponent;
let fixture: ComponentFixture<TotalStaircasesComponent>;

function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(TotalStaircasesComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    component.ngOnInit();

    fixture.detectChanges();
}

describe('TotalStaircasesComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TotalStaircasesComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    type Value = { total?: number, internal?: number };
    type TestCase = { description: string, value: Value };

    let testCasesShowError: TestCase[] = [
        { description: 'should show an error when the Staircases are undefined or empty.', value: {total: undefined, internal: undefined } },
        { description: 'should show an error when the number of internal staircases is greater than the number of total staircases.', value: {total: 10, internal: 12 } },
        { description: 'should show an error when the number of total staircases is greater than 99.', value: {total: 105, internal: 12 } },
        { description: 'should show an error when the number of total staircases is a negative number.', value: {total: -1, internal: 12 } },
        { description: 'should show an error when the number of internal staircases is a negative number.', value: {total: 10, internal: -2 }  },
        { description: 'should show an error when the number of internal staircases is greater than 99.', value: {total: 10, internal: 259 }  },
        { description: 'should show an error when the Staircases are a decimal number.', value: {total: 10.2, internal: 5.3 }  },
        { description: 'should show an error when the Staircases are 0.', value: {total: 0, internal: 0 }  },
    ]

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: Value) => {
                setup(applicationService);
                applicationService.model.Kbi!.KbiSections[0]!.Staircases.TotalNumberStaircases = value.total;
                applicationService.model.Kbi!.KbiSections[0]!.Staircases.InternalStaircasesAllFloors = value.internal;
                component.hasErrors = !component.canContinue();
                expect(component.roofTypeHasErrors).toBeTrue();
            }, test.value).execute();
    });

    let testCases: Value[] = [
        {total: 10, internal: 10 },
        {total: 20, internal: 5 },
        {total: 99, internal: 1 }, 
    ];

    new TestHelper()
        .setDescription('should NOT show an error when Staircases are valid.')
        .setTestCase((applicationService: ApplicationService, value: Value) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Staircases.TotalNumberStaircases = value.total;
            applicationService.model.Kbi!.KbiSections[0]!.Staircases.InternalStaircasesAllFloors = value.internal;
            component.hasErrors = !component.canContinue();
            expect(component.roofTypeHasErrors).toBeFalse();
        }, ...testCases).execute();

});