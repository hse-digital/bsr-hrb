import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { FireDoorsCommonComponent } from 'src/app/features/kbi/1-fire/fire-doors-common/fire-doors-common.component';

import { ApplicationService } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';

import { TestHelper } from 'src/tests/test-helper';

let component: FireDoorsCommonComponent;
let fixture: ComponentFixture<FireDoorsCommonComponent>;

function setup(applicationService: ApplicationService) {
    fixture = TestBed.createComponent(FireDoorsCommonComponent);
    component = fixture.componentInstance;

    applicationService.newApplication();

    applicationService.model.id = "ABC0123456789";
    applicationService.model.Sections = [{ Name: "Section1", Addresses: [{ Postcode: "ABC", IsManual: false }] }];

    applicationService.initKbi();

    applicationService.model.Kbi!.KbiSections[0].Fire = { FireDoorsCommon: {} };
    applicationService.model.Kbi!.KbiSections[0].Fire.FireDoorsCommon = {};
    applicationService._currentKbiSectionIndex = 0;



    fixture.detectChanges();
}

describe('FireDoorsCommonComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FireDoorsCommonComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService, KbiService]
        }).compileComponents();
    });

    let testCasesShowError: { description: string, values: any[] }[] = [
        { description: 'should show an error when the FireDoorsCommon is undefined or empty.', values: [undefined, ""] },
        { description: 'should show an error when the FireDoorsCommon is a negative number.', values: [-1, -100] },
        { description: 'should show an error when the FireDoorsCommon is a decimal number.', values: [1.2, 5.2] },
    ]

    testCasesShowError.forEach((test) => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.model.Kbi!.KbiSections[0]!.Fire.FireDoorsCommon!.FireDoorUnknown = value;
                applicationService.model.Kbi!.KbiSections[0]!.Fire.FireDoorsCommon!.FireDoorHundredTwentyMinute = value;
                applicationService.model.Kbi!.KbiSections[0]!.Fire.FireDoorsCommon!.FireDoorSixtyMinute = value;
                applicationService.model.Kbi!.KbiSections[0]!.Fire.FireDoorsCommon!.FireDoorThirtyMinute = value;
                component.hasErrors = !component.canContinue();
                expect(component.hasErrors).toBeTrue();
            }, ...test.values).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when FireDoorsCommon is valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.Kbi!.KbiSections[0]!.Fire.FireDoorsCommon!.FireDoorUnknown = value + randomOffset();
            applicationService.model.Kbi!.KbiSections[0]!.Fire.FireDoorsCommon!.FireDoorHundredTwentyMinute = value + randomOffset();
            applicationService.model.Kbi!.KbiSections[0]!.Fire.FireDoorsCommon!.FireDoorSixtyMinute = value + randomOffset();
            applicationService.model.Kbi!.KbiSections[0]!.Fire.FireDoorsCommon!.FireDoorThirtyMinute = value + randomOffset();
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
        }, 1, 3, 10, 88, 99, 500, 897).execute();

        function randomOffset() {
            return Math.floor(Math.random() * 100);
        }
});