import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { inject } from "@angular/core/testing";

import { ActingForAddressComponent } from 'src/app/features/application/accountable-person/organisation/acting-for-address/acting-for-address.component';

import { TestHelper } from 'src/tests/test-helper';


let component: ActingForAddressComponent;
let fixture: ComponentFixture<ActingForAddressComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    fixture = TestBed.createComponent(ActingForAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

xdescribe('ActingForAddressComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ActingForAddressComponent],
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
        {}
    ]

    new TestHelper()
        .setDescription("")
        .setTestCase((applicationService: ApplicationService, value: any) => {

        }).execute();

    
});