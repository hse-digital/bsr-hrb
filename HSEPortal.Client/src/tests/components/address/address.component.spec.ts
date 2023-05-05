import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestHelper } from 'src/tests/test-helper';
import { AddressComponent } from 'src/app/components/address/address.component';
import { AddressModel, AddressResponseModel } from 'src/app/services/address.service';

let component: AddressComponent;
let fixture: ComponentFixture<AddressComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

let addressResponseModel: AddressResponseModel = new AddressResponseModel();

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    component.searchModel = {};
    fixture.detectChanges();

    addressResponseModel.MaxResults = 100;
    addressResponseModel.Results = [
        { IsManual: false, Address: "Valid address", Postcode: "SW1A1AA" },
        { IsManual: false, Address: "Valid address 2", Postcode: "SW1A1AA" },
        { IsManual: false, Address: "Valid address 3", Postcode: "SW1A1AA" },
    ]
    addressResponseModel.TotalResults = addressResponseModel.Results.length;
}

describe('AddressComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddressComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        fixture = TestBed.createComponent(AddressComponent);
        component = fixture.componentInstance;
        component.searchModel = {};

        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.step).toEqual("find");
    });

    new TestHelper()
        .setDescription('Should show "select" step when number of addresses is more than one but less than 100.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.searchPerformed(addressResponseModel);
            expect(component.step).toEqual("select");
        }).execute();

    new TestHelper()
        .setDescription('Should show "too-many" step when number of addresses is greater than 100.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            addressResponseModel.TotalResults = value;
            component.searchPerformed(addressResponseModel);
            expect(component.step).toEqual("too-many");
        }, 100, 101, 500, 10000).execute();

    new TestHelper()
        .setDescription('Should show "confirm" step when number of addresses is only one.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            addressResponseModel.Results = [{ IsManual: false, Address: "Valid address", Postcode: "SW1A1AA" }];
            component.searchPerformed(addressResponseModel);
            expect(component.step).toEqual("confirm");
        }).execute();

    new TestHelper()
        .setDescription('Should show "not-found" step when number of addresses is zero.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            addressResponseModel.Results = [];
            component.searchPerformed(addressResponseModel);
            expect(component.step).toEqual("not-found");
        }).execute();

    new TestHelper()
        .setDescription('Should show "manual" step when onEnterManualAddress event is emitted.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.enterManualAddress();
            expect(component.step).toEqual("manual");
        }).execute();

    new TestHelper()
        .setDescription('Should show "find" step when onSearchAgain event is emitted.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.searchAgain();
            expect(component.step).toEqual("find");
        }).execute();


});