import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApDetailsComponent } from 'src/app/features/application/accountable-person/ap-details/ap-details.component';
import { inject } from "@angular/core/testing";
import { TestHelper } from '../test-helper';

let component: ApDetailsComponent;
let fixture: ComponentFixture<ApDetailsComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.model.AccountablePersons = [];
    applicationService.startAccountablePersonEdit();
    applicationService.currentAccountablePerson.FirstName = 'FirstName';
    applicationService.currentAccountablePerson.LastName = "LastName";

    fixture = TestBed.createComponent(ApDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('ApDetailsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApDetailsComponent],
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
        { email: undefined, phoneNumber: undefined },
    ]

    new TestHelper()
        .setDescription("should show an error is the email or the phone number are empty or undefined")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.Email = value.email;
            applicationService.currentAccountablePerson.PhoneNumber = value.phoneNumber;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, ...testCasesEmptyUndefined).execute();

    new TestHelper()
        .setDescription("should show an error is the email is empty or undefined but the phone number is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.Email = value;
            applicationService.currentAccountablePerson.PhoneNumber = "+441234567890";
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.emailHasErrors).toBeTrue();
            expect(component.phoneHasErrors).toBeFalse();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should show an error is the phone number is empty or undefined but the email is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.Email = "valid_email@validemail.com";
            applicationService.currentAccountablePerson.PhoneNumber = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.phoneHasErrors).toBeTrue();
            expect(component.emailHasErrors).toBeFalse();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should NOT show an error is the phone number and the email are valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.Email = value.email;
            applicationService.currentAccountablePerson.PhoneNumber = value.phoneNumber;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
            expect(component.phoneHasErrors).toBeFalse();
            expect(component.emailHasErrors).toBeFalse();
        }, {email: "valid_email@validemail.com", phoneNumber: "+441234567890"}).execute();
});