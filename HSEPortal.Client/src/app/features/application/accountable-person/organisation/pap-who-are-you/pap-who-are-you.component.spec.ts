import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject } from "@angular/core/testing";

import { TestHelper } from 'src/tests/test-helper';
import { PapWhoAreYouComponent } from './pap-who-are-you.component';

let component: PapWhoAreYouComponent;
let fixture: ComponentFixture<PapWhoAreYouComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();
    applicationService.model.AccountablePersons = [];
    applicationService.startAccountablePersonEdit();

    fixture = TestBed.createComponent(PapWhoAreYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('PapWhoAreYouComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PapWhoAreYouComponent],
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
        .setDescription("should show an error if the role is empty or undefined")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.Role = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeTrue();
            expect(component.roleHasErrors).toBeTrue();
        }, '', undefined).execute();

    new TestHelper()
        .setDescription("should NOT show an error if the role is valid")
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            applicationService.currentAccountablePerson.Role = value;
            component.hasErrors = !component.canContinue();
            expect(component.hasErrors).toBeFalse();
            expect(component.roleHasErrors).toBeFalse();
        }, "Pap role").execute();
});