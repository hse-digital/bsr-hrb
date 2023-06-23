import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';
import { TestHelper } from '../test-helper';
import { SectionYearRangeComponent } from 'src/app/features/application/building-summary/year-range/year-range.component';


let component: SectionYearRangeComponent;
let fixture: ComponentFixture<SectionYearRangeComponent>;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.startSectionsEdit();
    fixture.detectChanges();
}

describe('SectionYearRangeComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SectionYearRangeComponent],
            imports: [RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        fixture = TestBed.createComponent(SectionYearRangeComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription('should show an error when the YearOfCompletionRange is empty or undefined')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection.YearOfCompletionRange = value;
            component.hasErrors = !component.canContinue();
            expect(component.yearRangeHasErrors).toBeTrue();
        }, '', undefined).execute();


    new TestHelper()
        .setDescription('should NOT show an error when the YearOfCompletionRange is valid')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection.YearOfCompletionRange = value;
            component.hasErrors = !component.canContinue();
            expect(component.yearRangeHasErrors).toBeFalse();
        }, "2001-to-2006", "2019-to-2022").execute();

});