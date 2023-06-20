import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from '../test-helper';
import { SectionYearOfCompletionComponent } from 'src/app/features/application/building-summary/year-of-completion/year-of-completion.component';


let component: SectionYearOfCompletionComponent;
let fixture: ComponentFixture<SectionYearOfCompletionComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.startSectionsEdit();
}

describe('SectionYearOfCompletionComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SectionYearOfCompletionComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        fixture = TestBed.createComponent(SectionYearOfCompletionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription('should show an error when the YearOfCompletion is empty or undefined')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection.YearOfCompletion = value;
            applicationService.currentSection.YearOfCompletionOption = 'year-exact';
            component.hasErrors = !component.canContinue();
            expect(component.yearOfCompletionHasErrors).toBeTrue();
            expect(component.exactYearHasErrors).toBeTrue();
        }, '', undefined).execute();

    let testCases = [
        { description: "should show an error when the YearOfCompletion is in the future", years: ["2040", "2060", "3000", 2040, 2060, 3000] },
        { description: "should show an error when the YearOfCompletion is not a real year", years: ["123", "0", "123456", 0, 123 , 123456] },
        { description: "should show an error when the YearOfCompletion is not a number", years: ["1.987", "2.000", "123.4", "1,234", 1.987, 2.000, 123.4] },
    ]

    testCases.forEach(test => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase((applicationService: ApplicationService, value: any) => {
                setup(applicationService);
                applicationService.currentSection.YearOfCompletion = value;
                applicationService.currentSection.YearOfCompletionOption = 'year-exact';
                component.hasErrors = !component.canContinue();
                expect(component.yearOfCompletionHasErrors).toBeTrue();
                expect(component.exactYearHasErrors).toBeTrue();
            }, ...test.years).execute();
    });



    new TestHelper()
        .setDescription('should NOT show an error when the YearOfCompletion is valid')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection.YearOfCompletion = value;
            applicationService.currentSection.YearOfCompletionOption = 'year-exact';
            component.hasErrors = !component.canContinue();
            expect(component.yearOfCompletionHasErrors).toBeFalse();
            expect(component.exactYearHasErrors).toBeFalse();
        }, "1999", "2002", "1870", "2023").execute();

});