import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { inject } from "@angular/core/testing";
import { TestHelper } from '../test-helper';
import { ApNameComponent } from 'src/app/features/application/accountable-person/ap-name/ap-name.component';

let component: ApNameComponent;
let fixture: ComponentFixture<ApNameComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.model.AccountablePersons = [];
    applicationService.startAccountablePersonEdit();

    fixture = TestBed.createComponent(ApNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('ApDetailsComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApNameComponent],
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
        { firstName: '', lastName: '' },
        { firstName: '', lastName: undefined },
        { firstName: undefined, lastName: '' },
        { firstName: undefined, lastName: undefined },
    ]

    new TestHelper()
        .setDescription("should show an error if the first name or the last name are empty or undefined")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.FirstName = value.firstName;
            applicationService.currentAccountablePerson.LastName = value.lastName;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
        }, ...testCasesEmptyUndefined).execute();

    new TestHelper()
        .setDescription("should show an error if the first name is empty or undefined but the last name is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.FirstName = value;
            applicationService.currentAccountablePerson.LastName = "Last Name";
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.firstNameInError).toBeFalse();
            expect(component.lastNameInError).toBeTrue();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should show an error if the last name is empty or undefined but the first name is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.FirstName = "First Name";
            applicationService.currentAccountablePerson.LastName = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.firstNameInError).toBeTrue();
            expect(component.lastNameInError).toBeFalse();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should NOT show an error if the first name and the last name are valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.FirstName = value.firstName;
            applicationService.currentAccountablePerson.LastName = value.lastName;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
            expect(component.firstNameInError).toBeFalse();
            expect(component.lastNameInError).toBeFalse();
        }, { lastName: "Last Name", firstName: "First Name"}).execute();
});