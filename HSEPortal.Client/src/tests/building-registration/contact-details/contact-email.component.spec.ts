import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject } from "@angular/core/testing";

import { TestHelper } from 'src/tests/test-helper';
import { ContactEmailComponent } from 'src/app/features/new-application/contact-email/contact-email.component';


let component: ContactEmailComponent;
let fixture: ComponentFixture<ContactEmailComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.model.AccountablePersons = [];
    applicationService.startAccountablePersonEdit();

    fixture = TestBed.createComponent(ContactEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('ContactEmailComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactEmailComponent],
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
        .setDescription("should show an error if the contact email is empty or undefined")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.ContactEmailAddress = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should show an error if the contact email is not valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.ContactEmailAddress = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, 'notValidEmail', '@notvalidemail', '@notvalidemail.com', 'notvalidemail.com', 'notvalidemail@').execute();

    new TestHelper()
        .setDescription("should NOT show an error if the contact email is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.model.ContactEmailAddress = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
        }, "validemail@example.com", "valid_email@example.uk", "validEmail123@example.com").execute();
});