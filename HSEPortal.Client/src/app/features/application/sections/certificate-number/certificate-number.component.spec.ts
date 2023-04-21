import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject } from "@angular/core/testing";

import { TestHelper } from 'src/tests/test-helper';
import { CertificateNumberComponent } from './certificate-number.component';

let component: CertificateNumberComponent;
let fixture: ComponentFixture<CertificateNumberComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.startSectionsEdit();

    fixture = TestBed.createComponent(CertificateNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.isOptional = false;
}

describe('CertificateNumberComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CertificateNumberComponent],
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
        .setDescription("should show an error if the certificate number reference is empty or undefined (isOptional = false)")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection.CompletionCertificateReference = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.certificateHasErrors).toBeTrue();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should NOT show an error if the certificate number reference is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection.CompletionCertificateReference = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
            expect(component.certificateHasErrors).toBeFalse();
        }, "Completition Cerficate Reference").execute();
});