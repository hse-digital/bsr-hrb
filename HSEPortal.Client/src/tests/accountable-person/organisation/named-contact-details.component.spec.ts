import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject } from "@angular/core/testing";

import { TestHelper } from 'src/tests/test-helper';
import { OrganisationNamedContactDetailsComponent } from 'src/app/features/application/accountable-person/organisation/named-contact/named-contact-details.component';


let component: OrganisationNamedContactDetailsComponent;
let fixture: ComponentFixture<OrganisationNamedContactDetailsComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.model.AccountablePersons = [];
    applicationService.startAccountablePersonEdit();

    fixture = TestBed.createComponent(OrganisationNamedContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('OrganisationNamedContactDetailsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrganisationNamedContactDetailsComponent],
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

    let testCasesEmptyUndefined = [
        { email: '', phoneNumber: '' },
        { email: '', phoneNumber: undefined },
        { email: undefined, phoneNumber: '' },
        { email: undefined, phoneNumber: undefined},
    ]

    new TestHelper()
        .setDescription("should show an error if the email and the phone number are empty or undefined")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.NamedContactEmail = value.email;
            applicationService.currentAccountablePerson.NamedContactPhoneNumber = value.phoneNumber;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, ...testCasesEmptyUndefined).execute();

    new TestHelper()
        .setDescription("should show an error if the email is empty, undefined or not valid, but the phone number is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.NamedContactEmail = value;
            applicationService.currentAccountablePerson.NamedContactPhoneNumber = "+441234567890";
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.errors.email.hasErrors).toBeTrue();
            expect(component.errors.phoneNumber.hasErrors).toBeFalse();
        }, '', undefined, "abcd", "@efgh.com", "abcd.com").execute();

    new TestHelper()
        .setDescription("should show an error if the phone number is empty, undefined or not valid but the email and the job role are valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.NamedContactEmail = "valid_email@validemail.com";
            applicationService.currentAccountablePerson.NamedContactPhoneNumber = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.errors.email.hasErrors).toBeFalse();
            expect(component.errors.phoneNumber.hasErrors).toBeTrue();
        }, '', undefined, '0123', '+44123456789987654321', '+331234567890').execute();

    new TestHelper()
        .setDescription("should NOT show an error if the phone number, the job role and the email are valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.NamedContactEmail = value.email;
            applicationService.currentAccountablePerson.NamedContactPhoneNumber = value.phoneNumber;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
            expect(component.errors.email.hasErrors).toBeFalse();
            expect(component.errors.phoneNumber.hasErrors).toBeFalse();
        }, {email: "valid_email@validemail.com", phoneNumber: "+441234567890"}).execute();
});