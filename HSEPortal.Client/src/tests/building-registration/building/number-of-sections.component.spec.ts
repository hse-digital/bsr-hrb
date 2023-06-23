import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject } from "@angular/core/testing";

import { TestHelper } from 'src/tests/test-helper';
import { NumberOfSectionsComponment } from 'src/app/features/application/building-summary/number-of-sections/number-of-sections.component';

let component: NumberOfSectionsComponment;
let fixture: ComponentFixture<NumberOfSectionsComponment>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.startSectionsEdit();

    fixture = TestBed.createComponent(NumberOfSectionsComponment);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('NumberOfSectionsComponment showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NumberOfSectionsComponment],
            imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', inject([ApplicationService], (applicationService: ApplicationService) => {
        setup(applicationService);
        expect(component).toBeTruthy();
    }));

    new TestHelper()
        .setDescription("should show an error if the NumberOfSections is empty or undefined.")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.NumberOfSections = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.numberOfSectionsHasErrors).toBeTrue();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should NOT show an error if the NumberOfSections is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.NumberOfSections = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
            expect(component.numberOfSectionsHasErrors).toBeFalse();
        }, "yes", "no").execute();
});