import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ApplicationService } from 'src/app/services/application.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestHelper } from 'src/tests/test-helper';
import { FindAddressComponent } from 'src/app/components/address/find-address.component';
import { AddressSearchMode } from 'src/app/components/address/address.component';

let component: FindAddressComponent;
let fixture: ComponentFixture<FindAddressComponent>;

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

function setup(applicationService: ApplicationService) {
    applicationService.newApplication();

    fixture = TestBed.createComponent(FindAddressComponent);
    component = fixture.componentInstance;
    component.searchModel = {};

    fixture.detectChanges();
}

describe('FindAddressComponent showError', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FindAddressComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, HseAngularModule, ComponentsModule],
            providers: [ApplicationService]
        }).compileComponents();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        fixture = TestBed.createComponent(FindAddressComponent);
        component = fixture.componentInstance;
        component.searchModel = {};

        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    let testCases: { postcode?: string, addressLine1?: string }[] = [
        { postcode: "", addressLine1: "" },
        { postcode: undefined, addressLine1: undefined },
        { postcode: "", addressLine1: undefined },
        { postcode: undefined, addressLine1: "" }
    ];

    new TestHelper()
        .setDescription('Should show an error when the postcode and the address are undefined or empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.searchModel.postcode = value.postcode;
            component.searchModel.addressLine1 = value.addressLine1;
            expect(component.isPostcodeValid()).toBeFalse();
            expect(component.postcodeHasErrors).toBeTrue();
        }, ...testCases).execute();

    new TestHelper()
        .setDescription('Should show an error when the postcode is undefined or empty, but the address is valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.searchModel.postcode = value;
            component.searchModel.addressLine1 = "Valid address line";
            expect(component.isPostcodeValid()).toBeFalse();
            expect(component.postcodeHasErrors).toBeTrue();
        }, "", undefined).execute();

    new TestHelper()
        .setDescription('Should NOT show an error when the postcode is valid, but the address is undefined or empty.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.searchModel.postcode = "SW1A1AA"; // Valid postcode.
            component.searchModel.addressLine1 = value;
            expect(component.isPostcodeValid()).toBeTrue();
            expect(component.postcodeHasErrors).toBeFalse();
        }, "", undefined).execute();


    new TestHelper()
        .setDescription('Should NOT show an error when the postcode and the address are valid.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.searchModel.postcode = "SW1A1AA"; // Valid postcode.
            component.searchModel.addressLine1 = "Valid address line";
            expect(component.isPostcodeValid()).toBeTrue();
            expect(component.postcodeHasErrors).toBeFalse();
        }).execute();

    let testCasesFindAddressAPI: { searchMode: AddressSearchMode, endpoint: string }[] = [
        { searchMode: AddressSearchMode.Building, endpoint: "SearchBuildingByPostcode" },
        { searchMode: AddressSearchMode.PostalAddress, endpoint: "SearchPostalAddressByPostcode" }
    ];
    
    new TestHelper()
        .setDescription('Should call the search API when the postcode is valid and the addressSearchMode is Building or PostalAddress.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);
            component.searchModel.postcode = "SW1A1AA"; // Valid postcode.
            
            expect(component.isPostcodeValid()).toBeTrue();
            expect(component.postcodeHasErrors).toBeFalse();
            
            let route = `api/${value.endpoint}/${component.searchModel.postcode}`;
            component.searchMode = value.searchMode;

            component.findAddress();

            httpTestingController.match(route);
            httpTestingController.verify();

        }, ...testCasesFindAddressAPI).execute();
    
    new TestHelper()
        .setDescription('Should call the search API when the address is valid and the addressSearchMode is FreeSearch.')
        .setTestCase((applicationService: ApplicationService, value: any) => {
            setup(applicationService);

            component.searchModel.postcode = "SW1A1AA"; // Valid postcode.
            component.searchModel.addressLine1 = "Street";
            
            expect(component.isPostcodeValid()).toBeTrue();
            expect(component.postcodeHasErrors).toBeFalse();
            
            let route = `api/${value.endpoint}/${component.searchModel.addressLine1}`;
            component.searchMode = value.searchMode;

            component.findAddress();

            httpTestingController.match(route);
            httpTestingController.verify();

        }, { searchMode: AddressSearchMode.FreeSearch, endpoint: "SearchAddress" }).execute();
});