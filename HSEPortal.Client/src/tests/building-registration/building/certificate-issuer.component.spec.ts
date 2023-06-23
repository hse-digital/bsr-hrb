import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject } from "@angular/core/testing";

import { TestHelper } from 'src/tests/test-helper';
import { CertificateIssuerComponent } from 'src/app/features/application/building-summary/certificate-issuer/certificate-issuer.component';

let component: CertificateIssuerComponent;
let fixture: ComponentFixture<CertificateIssuerComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.startSectionsEdit();

    fixture = TestBed.createComponent(CertificateIssuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.isOptional = false;
}

describe('CertificateIssuerComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CertificateIssuerComponent],
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
        .setDescription("should show an error if the certificate issuer is empty or undefined (isOptional = false)")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection.CompletionCertificateIssuer = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.certificateHasErrors).toBeTrue();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should NOT show an error if the certificate issuer is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentSection.CompletionCertificateIssuer = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
            expect(component.certificateHasErrors).toBeFalse();
        }, "Cerficate Issuer").execute();
});