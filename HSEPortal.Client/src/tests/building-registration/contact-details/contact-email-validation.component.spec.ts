import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject } from "@angular/core/testing";

import { TestHelper } from 'src/tests/test-helper';
import { ContactEmailValidationComponent } from 'src/app/features/new-application/contact-email/contact-email-validation.component';

let component: ContactEmailValidationComponent;
let fixture: ComponentFixture<ContactEmailValidationComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.model.AccountablePersons = [];
    applicationService.startAccountablePersonEdit();

    fixture = TestBed.createComponent(ContactEmailValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('ContactEmailValidationComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactEmailValidationComponent],
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
        .setDescription("should show an error if the otp code is empty or undefined")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.otpToken = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should show an error if the otp code is not valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.otpToken = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, '0', '0123456789', '0 1 2 3 4 5', 'ab123').execute();

    new TestHelper()
        .setDescription("should NOT show an error if otp code role is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.otpToken = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
        }, "012345", "123456", "abc123").execute();
});