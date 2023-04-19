import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { TestHelper } from "../test-helper";
import { ComponentsModule } from "src/app/components/components.module";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from "@angular/core";
import { ReturningApplicationVerifyComponent } from "src/app/features/returning-application/verify.component";

describe('ReturningApplicationVerifyComponent showErrors', () => {
    let component: ReturningApplicationVerifyComponent;
    let fixture: ComponentFixture<ReturningApplicationVerifyComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReturningApplicationVerifyComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        fixture = TestBed.createComponent(ReturningApplicationVerifyComponent);
        component = fixture.componentInstance;
        httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    new TestHelper()
        .setDescription("should show an error when the security code has more or less than 6 digits.")
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            component.securityCode = value;
            await component.validateAndContinue();
            expect(component.hasErrors).toBeTrue();
        }, "01234", "0", "0123456", "0123456789").execute();


    new TestHelper()
        .setDescription('should show an error when the security code is empty or undefined.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            component.securityCode = value;
            await component.validateAndContinue();
            expect(component.hasErrors).toBeTrue();
        }, '', undefined).execute();
});

describe('ReturningApplicationVerifyComponent getErrorDescription(value, errorText)', () => {
    let component: ReturningApplicationVerifyComponent;
    let fixture: ComponentFixture<ReturningApplicationVerifyComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReturningApplicationVerifyComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        fixture = TestBed.createComponent(ReturningApplicationVerifyComponent);
        component = fixture.componentInstance;
        httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);

        fixture.detectChanges();
    });

    new TestHelper()
        .setDescription("should show an error message when the security code has more or less than 6 digits.")
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            component.securityCode = value;
            await component.validateAndContinue();
            expect(component.getErrorDescription(component.hasErrors, 'Error message')).toBeDefined();
            expect(component.getErrorDescription(component.hasErrors, 'Error message')).toEqual('Error message');
        }, "01234", "0", "0123456", "0123456789").execute();


    new TestHelper()
        .setDescription('should show an error when the security code is empty or undefined.')
        .setTestCase(async (applicationService: ApplicationService, value: any) => {
            component.securityCode = value;
            await component.validateAndContinue();
            expect(component.getErrorDescription(component.hasErrors, 'Error message 2')).toBeDefined();
            expect(component.getErrorDescription(component.hasErrors, 'Error message 2')).toEqual('Error message 2');
        }, '', undefined).execute();
});