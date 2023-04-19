import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { TestHelper } from "../test-helper";
import { ReturningApplicationEnterDataComponent } from "src/app/features/returning-application/enterdata.component";
import { ComponentsModule } from "src/app/components/components.module";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from "@angular/common/http";

describe('ReturningApplicationEnterDataComponent showError', () => {
    let component: ReturningApplicationEnterDataComponent;
    let fixture: ComponentFixture<ReturningApplicationEnterDataComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReturningApplicationEnterDataComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        fixture = TestBed.createComponent(ReturningApplicationEnterDataComponent);
        component = fixture.componentInstance;
        
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    let testCasesShowError = [
        { description: 'should show an error when the application number is empty or undefined.', applicationNumber: ['', undefined] },
        { description: 'should show an error when the application number does not have 12 digits.', applicationNumber: ['4412345', '441234567890123456'] },
    ]

    testCasesShowError.forEach(test => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                component.applicationNumber = value;
                component.emailAddress = "emailaddress@example.com";
                await component.validateAndContinue();
                expect(component.errors.applicationNumber.hasError).toBeTrue();
                expect(component.hasErrors).toBeTrue();
            }, ...test.applicationNumber).execute();
    });

    new TestHelper()
        .setDescription('should show an error when the email address is empty or undefined.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            component.applicationNumber = '012345678901';
            component.emailAddress = value;
            await component.validateAndContinue();
            expect(component.errors.emailAddress.hasError).toBeTrue();
            expect(component.hasErrors).toBeTrue();
        }, '', undefined).execute();

    let testCasesShowErrorEmailAndAppNumber = [
        { description: 'should show an error when the email and the application number are empty.', email: '', applicationNumber: '' },
        { description: 'should show an error when the email and the application number are undefined.', email: undefined, applicationNumber: undefined },
        { description: 'should show an error when the email is empty but application number is valid.', email: '', applicationNumber: '000123456789' },
        { description: 'should show an error when the application number is empty but email is valid.', email: 'email@abcd.com', applicationNumber: '' },
        { description: 'should show an error when the length of the application number is less than 12 but the email is valid.', email: 'email@abcd.com', applicationNumber: '01234' },
        { description: 'should show an error when the length of the application number is greater than 12 but the email is valid.', email: 'email@abcd.com', applicationNumber: '0001234456789000111222333' },
    ];

    testCasesShowErrorEmailAndAppNumber.forEach(test => {
        new TestHelper()
            .setDescription(test.description)
            .setTestCase(async (applicationService: ApplicationService, value: any) => {
                component.applicationNumber = value.applicationNumber;
                component.emailAddress = value.email;
                await component.validateAndContinue();

                let route = `api/ValidateApplicationNumber/${value.email}/${value.applicationNumber}`;
                httpTestingController.expectNone(route);
                
                let routeSendVerificationEmail = `api/SendVerificationEmail/${value.email}`;
                httpTestingController.expectNone(routeSendVerificationEmail);
                
                httpTestingController.verify();

                expect(component.hasErrors).toBeTrue();
            }, { email: test.email, applicationNumber: test.applicationNumber }).execute();
    });

    new TestHelper()
        .setDescription('should NOT show an error when the application number and the email are valid.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            component.applicationNumber = value.applicationNumber;
            component.emailAddress = value.email;            
            component.validateAndContinue();
            
            let route = `api/ValidateApplicationNumber/${value.email}/${value.applicationNumber}`;
            httpTestingController.match(route);
            
            let routeSendVerificationEmail = `api/SendVerificationEmail/${value.email}`;
            httpTestingController.match(routeSendVerificationEmail);

            expect(component.hasErrors).toBeFalse();

            httpTestingController.verify();
        }, {email: "validemailaddress@abcd.com", applicationNumber: "012345678901"}).execute();

});