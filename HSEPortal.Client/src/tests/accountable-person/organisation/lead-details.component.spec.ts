import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject } from "@angular/core/testing";
import { LeadDetailsComponent } from 'src/app/features/application/accountable-person/organisation/lead-details/lead-details.component';
import { TestHelper } from 'src/tests/test-helper';


let component: LeadDetailsComponent;
let fixture: ComponentFixture<LeadDetailsComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.model.AccountablePersons = [];
    applicationService.startAccountablePersonEdit();

    fixture = TestBed.createComponent(LeadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('LeadDetailsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LeadDetailsComponent],
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
        { email: '', phoneNumber: '', jobRole: '' },
        { email: '', phoneNumber: '', jobRole: undefined },
        { email: '', phoneNumber: undefined, jobRole: '' },
        { email: '', phoneNumber: undefined, jobRole: undefined },
        { email: undefined, phoneNumber: '', jobRole: '' },
        { email: undefined, phoneNumber: '', jobRole: undefined },
        { email: undefined, phoneNumber: undefined, jobRole: '' },
        { email: undefined, phoneNumber: undefined, jobRole: undefined },
    ]

    new TestHelper()
        .setDescription("should show an error if the email, the phone number and the job role are empty or undefined")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.LeadEmail = value.email;
            applicationService.currentAccountablePerson.LeadPhoneNumber = value.phoneNumber;
            applicationService.currentAccountablePerson.LeadJobRole = value.jobRole;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, ...testCasesEmptyUndefined).execute();

    new TestHelper()
        .setDescription("should show an error if the email is empty, undefined or not valid, but the phone number and the job role are valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.LeadEmail = value;
            applicationService.currentAccountablePerson.LeadPhoneNumber = "+441234567890";
            applicationService.currentAccountablePerson.LeadJobRole = "Lead job role";
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.emailHasErrors).toBeTrue();
            expect(component.phoneHasErrors).toBeFalse();
            expect(component.jobRoleHasErrors).toBeFalse();
        }, '', undefined, "abcd", "@efgh.com", "abcd.com").execute();

    new TestHelper()
        .setDescription("should show an error if the phone number is empty, undefined or not valid, but the email and the job role are valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.LeadEmail = "valid_email@validemail.com";
            applicationService.currentAccountablePerson.LeadPhoneNumber = value;            
            applicationService.currentAccountablePerson.LeadJobRole = "Lead job role";
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.phoneHasErrors).toBeTrue();
            expect(component.emailHasErrors).toBeFalse();
            expect(component.jobRoleHasErrors).toBeFalse();
        }, '', undefined, '0123', '+44123456789987654321', '+331234567890').execute();

    new TestHelper()
        .setDescription("should show an error if the job role is empty or undefined but the email and the phone number are valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.LeadEmail = "valid_email@validemail.com";
            applicationService.currentAccountablePerson.LeadPhoneNumber = "+441234567890";            
            applicationService.currentAccountablePerson.LeadJobRole = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.phoneHasErrors).toBeFalse();
            expect(component.emailHasErrors).toBeFalse();
            expect(component.jobRoleHasErrors).toBeTrue();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should NOT show an error if the phone number, the job role and the email are valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.LeadEmail = value.email;
            applicationService.currentAccountablePerson.LeadPhoneNumber = value.phoneNumber;
            applicationService.currentAccountablePerson.LeadJobRole = value.jobRole;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
            expect(component.phoneHasErrors).toBeFalse();
            expect(component.emailHasErrors).toBeFalse();
            expect(component.jobRoleHasErrors).toBeFalse();
        }, {email: "valid_email@validemail.com", phoneNumber: "+441234567890", jobRole: "valid job role"}).execute();
});